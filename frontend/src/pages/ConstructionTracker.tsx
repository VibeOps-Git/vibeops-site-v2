import { useState } from "react";
import Plot from "react-plotly.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface Task {
  activityName: string;
  duration: string; // days (string for UI)
  start: string; // yyyy-mm-dd
  predecessors: string; // comma-separated
  personnel: string;
  equipment: string;
}

interface BackendTask {
  activityName: string;
  phase: string;
  start: string;
  duration: number;
  immediatePredecessor: string[];
  crew: string;
  personnel: number;
  equipment: number;
}

interface ProgressRow {
  taskName: string;
  budgetedCost: string;
  actualCost: string;
  percentComplete: string;
  actualStart: string;
  actualFinish: string;
}

interface Metrics {
  schedule_variance?: number | null;
  cost_variance?: number | null;
  critical_path?: string | null;
  planned_finish?: string | null;
  schedule_performance_index?: number | null;
  cost_performance_index?: number | null;
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function addDays(d: Date, days: number): Date {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function getExampleTasks(): Task[] {
  const today = new Date();

  return [
    {
      activityName: "A",
      duration: "3",
      start: formatDate(today),
      predecessors: "",
      personnel: "5",
      equipment: "1",
    },
    {
      activityName: "B",
      duration: "4",
      start: formatDate(today),
      predecessors: "",
      personnel: "6",
      equipment: "0",
    },
    {
      activityName: "C",
      duration: "4",
      start: formatDate(addDays(today, 2)),
      predecessors: "A",
      personnel: "5",
      equipment: "1",
    },
    {
      activityName: "D",
      duration: "7",
      start: formatDate(addDays(today, 2)),
      predecessors: "A",
      personnel: "4",
      equipment: "1",
    },
    {
      activityName: "E",
      duration: "4",
      start: formatDate(addDays(today, 5)),
      predecessors: "C",
      personnel: "5",
      equipment: "1",
    },
    {
      activityName: "F",
      duration: "7",
      start: formatDate(addDays(today, 5)),
      predecessors: "C",
      personnel: "7",
      equipment: "0",
    },
    {
      activityName: "G",
      duration: "3",
      start: formatDate(addDays(today, 8)),
      predecessors: "D, E",
      personnel: "3",
      equipment: "0",
    },
    {
      activityName: "H",
      duration: "7",
      start: formatDate(addDays(today, 11)),
      predecessors: "F, G",
      personnel: "7",
      equipment: "1",
    },
  ];
}

function buildInsights(metrics: Metrics | null): string {
  if (!metrics) return "";

  const { cost_variance: cv, schedule_variance: sv, schedule_performance_index: spi, cost_performance_index: cpi } =
    metrics;

  const parts: string[] = [];

  if (typeof cv === "number") {
    if (cv < 0) {
      parts.push(
        `- Over budget: approximately $${Math.abs(cv).toLocaleString()} over the planned cost.`
      );
    } else if (cv > 0) {
      parts.push(
        `- Under budget: approximately $${cv.toLocaleString()} ahead of the planned cost.`
      );
    } else {
      parts.push("- On budget: cost variance is ~0.");
    }
  }

  if (typeof sv === "number") {
    if (sv < 0) {
      parts.push(
        `- Behind schedule: roughly $${Math.abs(sv).toLocaleString()} in planned value has not yet been earned.`
      );
    } else if (sv > 0) {
      parts.push(
        `- Ahead of schedule: roughly $${sv.toLocaleString()} in earned value ahead of plan.`
      );
    } else {
      parts.push("- On schedule: schedule variance is ~0.");
    }
  }

  if (typeof spi === "number") {
    parts.push(`- SPI (Schedule Performance Index): ${spi.toFixed(2)}`);
  }

  if (typeof cpi === "number") {
    parts.push(`- CPI (Cost Performance Index): ${cpi.toFixed(2)}`);
  }

  return parts.join("\n");
}

export default function ConstructionTracker() {
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState("");

  const [tasks, setTasks] = useState<Task[]>([
    {
      activityName: "",
      duration: "",
      start: "",
      predecessors: "",
      personnel: "",
      equipment: "",
    },
  ]);

  // Store the mapped tasks actually sent to backend (for progress/EV/PV)
  const [lastSubmittedTasks, setLastSubmittedTasks] = useState<BackendTask[] | null>(null);

  // Gantt & histograms
  const [ganttData, setGanttData] = useState<any[] | null>(null);
  const [ganttLayout, setGanttLayout] = useState<any | null>(null);
  const [personnelData, setPersonnelData] = useState<any[] | null>(null);
  const [personnelLayout, setPersonnelLayout] = useState<any | null>(null);
  const [equipmentData, setEquipmentData] = useState<any[] | null>(null);
  const [equipmentLayout, setEquipmentLayout] = useState<any | null>(null);

  // Progress / S-curve / metrics / insights
  const [progressRows, setProgressRows] = useState<ProgressRow[]>([]);
  const [sCurveData, setSCurveData] = useState<any[] | null>(null);
  const [sCurveLayout, setSCurveLayout] = useState<any | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [insights, setInsights] = useState<string>("");

  // Fullscreen Gantt modal
  const [ganttFullscreenOpen, setGanttFullscreenOpen] = useState(false);

  const addTask = () => {
    setTasks((prev) => [
      ...prev,
      {
        activityName: "",
        duration: "",
        start: "",
        predecessors: "",
        personnel: "",
        equipment: "",
      },
    ]);
  };

  const removeTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTask = (index: number, field: keyof Task, value: string) => {
    setTasks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const loadExampleSchedule = () => {
    setTasks(getExampleTasks());
    if (!projectName) {
      setProjectName("Office Building Renovation – Example");
    }
    toast.info("Inserted example schedule for testing.");
  };

  const initProgressRowsFromTasks = (backendTasks: BackendTask[]) => {
    const rows: ProgressRow[] = backendTasks.map((t) => ({
      taskName: t.activityName,
      budgetedCost: "0",
      actualCost: "0",
      percentComplete: "0",
      actualStart: "",
      actualFinish: "",
    }));
    setProgressRows(rows);
    setSCurveData(null);
    setSCurveLayout(null);
    setMetrics(null);
    setInsights("");
  };

  const updateProgressRow = (
    index: number,
    field: keyof ProgressRow,
    value: string
  ) => {
    setProgressRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const loadExampleProgress = () => {
    if (!lastSubmittedTasks || lastSubmittedTasks.length === 0) {
      toast.error("Generate a Gantt chart first before inserting example progress.");
      return;
    }

    const exampleRows: ProgressRow[] = lastSubmittedTasks.map((task, idx) => {
      const startDate = new Date(task.start);
      const durationDays = Number(task.duration) || 1;
      const halfway = Math.floor(durationDays / 2);
      const finishDate = new Date(
        startDate.getTime() + halfway * 24 * 3600 * 1000
      );

      const budgeted = 1000 + idx * 100;
      const actual = Math.round(budgeted * 0.8);
      const pct = durationDays > 1 ? 50 : 100;

      return {
        taskName: task.activityName,
        budgetedCost: String(budgeted),
        actualCost: String(actual),
        percentComplete: String(pct),
        actualStart: formatDate(startDate),
        actualFinish: formatDate(finishDate),
      };
    });

    setProgressRows(exampleRows);
    toast.info("Inserted example progress data.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const mappedTasks: BackendTask[] = tasks.map((t, idx) => {
        const durationNum = Number(t.duration);
        const personnelNum = Number(t.personnel || 0);
        const equipmentNum = Number(t.equipment || 0);

        const preds =
          t.predecessors
            ?.split(",")
            .map((p) => p.trim())
            .filter(Boolean) ?? [];

        return {
          activityName: t.activityName,
          phase: "",
          start: t.start,
          duration: isNaN(durationNum) ? 0 : durationNum,
          immediatePredecessor: preds,
          crew: `C-${idx + 1}`,
          personnel: isNaN(personnelNum) ? 0 : personnelNum,
          equipment: isNaN(equipmentNum) ? 0 : equipmentNum,
        };
      });

      const payload = {
        project_name: projectName,
        tasks: mappedTasks,
      };

      const response = await api.submitConstructionTracker(payload);
      const text = await response.text();

      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        console.warn("Construction-tracker response was not JSON:", text);
      }

      if (!response.ok) {
        console.error("Construction tracker error body:", text);
        toast.error(
          (data && (data.error || data.message)) ||
            "Failed to analyze project. Check backend logs."
        );
        return;
      }

      toast.success("Analysis completed successfully!");
      console.log("Construction tracker backend data:", data);

      // Save tasks for progress / EV / PV use later
      setLastSubmittedTasks(mappedTasks);
      initProgressRowsFromTasks(mappedTasks);

      // Gantt
      if (data?.gantt_data?.data && data?.gantt_data?.layout) {
        setGanttData(data.gantt_data.data);
        setGanttLayout({
          ...data.gantt_data.layout,
          height: Math.max(300, mappedTasks.length * 30),
          title: projectName || data.gantt_data.layout?.title,
        });
      } else {
        setGanttData(null);
        setGanttLayout(null);
        toast.error("Backend did not return gantt_data.");
      }

      // Resource histograms
      if (data?.personnel_data?.data && data?.personnel_data?.layout) {
        setPersonnelData(data.personnel_data.data);
        setPersonnelLayout(data.personnel_data.layout);
      } else {
        setPersonnelData(null);
        setPersonnelLayout(null);
      }

      if (data?.equipment_data?.data && data?.equipment_data?.layout) {
        setEquipmentData(data.equipment_data.data);
        setEquipmentLayout(data.equipment_data.layout);
      } else {
        setEquipmentData(null);
        setEquipmentLayout(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProgress = async () => {
    if (!lastSubmittedTasks || lastSubmittedTasks.length === 0) {
      toast.error("Generate a Gantt chart first.");
      return;
    }

    if (progressRows.length === 0) {
      toast.error("No progress rows to submit.");
      return;
    }

    // Validate & map
    const progressPayload: any[] = [];
    let valid = true;

    progressRows.forEach((row, idx) => {
      const budgeted = parseFloat(row.budgetedCost);
      const actualCost = parseFloat(row.actualCost);
      const percent = parseFloat(row.percentComplete);

      if (isNaN(budgeted) || budgeted < 0) {
        valid = false;
      }
      if (isNaN(actualCost) || actualCost < 0) {
        valid = false;
      }
      if (isNaN(percent) || percent < 0 || percent > 100) {
        valid = false;
      }
      // Dates can be empty; backend can choose how strict it wants to be
      progressPayload.push({
        taskIndex: idx,
        percentComplete: isNaN(percent) ? 0 : percent,
        actualCost: isNaN(actualCost) ? 0 : actualCost,
        budgetedCost: isNaN(budgeted) ? 0 : budgeted,
        actualStart: row.actualStart || null,
        actualFinish: row.actualFinish || null,
      });
    });

    if (!valid) {
      toast.error("Please fix invalid progress entries (non-negative costs & 0–100% complete).");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        tasks: lastSubmittedTasks,
        progress: progressPayload,
        report_date: formatDate(new Date()),
      };

      const response = await api.submitConstructionProgress(payload);
      const text = await response.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        console.warn("construction-tracker-progress response was not JSON:", text);
      }

      if (!response.ok) {
        console.error("Construction tracker progress error body:", text);
        toast.error(
          (data && (data.error || data.message)) ||
            "Failed to analyze progress. Check backend logs."
        );
        return;
      }

      // S-curve
      if (data?.s_curve_data?.data && data?.s_curve_data?.layout) {
        setSCurveData(data.s_curve_data.data);
        setSCurveLayout(data.s_curve_data.layout);
      } else {
        setSCurveData(null);
        setSCurveLayout(null);
        toast.error("Backend did not return s_curve_data.");
      }

      // Metrics
      if (data?.metrics) {
        setMetrics(data.metrics);
        setInsights(buildInsights(data.metrics));
      } else {
        setMetrics(null);
        setInsights("");
        toast.error("Backend did not return performance metrics.");
      }

      toast.success("Progress analysis completed.");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while analyzing progress.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <section className="max-w-6xl mx-auto">
        <h1 className="section-title text-center">Construction Tracker</h1>
        <p className="section-text text-center">
          CPM Analysis, Gantt Chart, and Progress Tracking for Construction
          Projects.
        </p>

        {/* INPUT / TASK DEFINITION */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Enter your construction project tasks for CPM analysis or load an
              example schedule.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                  placeholder="e.g., Building Construction Project"
                />
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-lg font-semibold">Tasks</h3>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={loadExampleSchedule}
                    >
                      Insert Example Schedule
                    </Button>
                    <Button type="button" onClick={addTask} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {tasks.map((task, index) => (
                    <Card key={index} className="bg-secondary/50">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                          <div>
                            <Label htmlFor={`activity-${index}`}>Activity</Label>
                            <Input
                              id={`activity-${index}`}
                              value={task.activityName}
                              onChange={(e) =>
                                updateTask(
                                  index,
                                  "activityName",
                                  e.target.value
                                )
                              }
                              required
                              placeholder="Task name (e.g., A)"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`duration-${index}`}>
                              Duration (days)
                            </Label>
                            <Input
                              id={`duration-${index}`}
                              type="number"
                              value={task.duration}
                              onChange={(e) =>
                                updateTask(index, "duration", e.target.value)
                              }
                              required
                              placeholder="10"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`start-${index}`}>Start Date</Label>
                            <Input
                              id={`start-${index}`}
                              type="date"
                              value={task.start}
                              onChange={(e) =>
                                updateTask(index, "start", e.target.value)
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`pred-${index}`}>Predecessors</Label>
                            <Input
                              id={`pred-${index}`}
                              value={task.predecessors}
                              onChange={(e) =>
                                updateTask(
                                  index,
                                  "predecessors",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., A, B"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`pers-${index}`}>Personnel</Label>
                            <Input
                              id={`pers-${index}`}
                              type="number"
                              value={task.personnel}
                              onChange={(e) =>
                                updateTask(index, "personnel", e.target.value)
                              }
                              placeholder="5"
                            />
                          </div>
                          <div className="flex items-end gap-2">
                            <div className="flex-1">
                              <Label htmlFor={`equip-${index}`}>
                                Equipment
                              </Label>
                              <Input
                                id={`equip-${index}`}
                                type="number"
                                value={task.equipment}
                                onChange={(e) =>
                                  updateTask(
                                    index,
                                    "equipment",
                                    e.target.value
                                  )
                                }
                                placeholder="2"
                              />
                            </div>
                            {tasks.length > 1 && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeTask(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading
                  ? "Analyzing..."
                  : "Generate Gantt Chart & CPM Analysis"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* GANTT CHART */}
        {ganttData && ganttLayout && (
          <Card className="mt-10">
            <CardHeader>
              <CardTitle>Project Gantt Chart</CardTitle>
              <CardDescription>
                Click the chart to open a fullscreen view.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="w-full h-[400px] md:h-[500px] cursor-zoom-in"
                onClick={() => setGanttFullscreenOpen(true)}
              >
                <Plot
                  data={ganttData}
                  layout={{
                    ...ganttLayout,
                    autosize: true,
                  }}
                  style={{ width: "100%", height: "100%" }}
                  useResizeHandler
                  config={{
                    responsive: true,
                    displaylogo: false,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* RESOURCE HISTOGRAMS */}
        {((personnelData && personnelLayout) ||
          (equipmentData && equipmentLayout)) && (
          <Card className="mt-10">
            <CardHeader>
              <CardTitle>Resource Usage</CardTitle>
              <CardDescription>
                Personnel and equipment histograms from the schedule.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {personnelData && personnelLayout && (
                <div className="w-full h-[300px]">
                  <Plot
                    data={personnelData}
                    layout={{
                      ...personnelLayout,
                      autosize: true,
                    }}
                    style={{ width: "100%", height: "100%" }}
                    useResizeHandler
                    config={{ responsive: true, displaylogo: false }}
                  />
                </div>
              )}

              {equipmentData && equipmentLayout && (
                <div className="w-full h-[300px]">
                  <Plot
                    data={equipmentData}
                    layout={{
                      ...equipmentLayout,
                      autosize: true,
                    }}
                    style={{ width: "100%", height: "100%" }}
                    useResizeHandler
                    config={{ responsive: true, displaylogo: false }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* PROGRESS & COSTS SECTION (after Gantt generated) */}
        {lastSubmittedTasks && progressRows.length > 0 && (
          <Card className="mt-10">
            <CardHeader>
              <CardTitle>Report Progress & Costs</CardTitle>
              <CardDescription>
                Enter budgeted and actual costs, completion %, and (optionally)
                actual start/finish dates to generate S-curves and performance
                metrics.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <p className="text-sm text-muted-foreground">
                  You&apos;ll get EV/PV/AC S-curves plus SPI, CPI and simple
                  insights based on your entries.
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={loadExampleProgress}
                  >
                    Insert Example Progress Data
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-2">Task</th>
                      <th className="text-left py-2 px-2">Budgeted Cost ($)</th>
                      <th className="text-left py-2 px-2">Actual Cost ($)</th>
                      <th className="text-left py-2 px-2">% Complete</th>
                      <th className="text-left py-2 px-2">Actual Start</th>
                      <th className="text-left py-2 px-2">Actual Finish</th>
                    </tr>
                  </thead>
                  <tbody>
                    {progressRows.map((row, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-2 pr-2 font-medium">
                          {row.taskName}
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            type="number"
                            value={row.budgetedCost}
                            onChange={(e) =>
                              updateProgressRow(
                                index,
                                "budgetedCost",
                                e.target.value
                              )
                            }
                            min={0}
                          />
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            type="number"
                            value={row.actualCost}
                            onChange={(e) =>
                              updateProgressRow(
                                index,
                                "actualCost",
                                e.target.value
                              )
                            }
                            min={0}
                          />
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            type="number"
                            value={row.percentComplete}
                            onChange={(e) =>
                              updateProgressRow(
                                index,
                                "percentComplete",
                                e.target.value
                              )
                            }
                            min={0}
                            max={100}
                          />
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            type="date"
                            value={row.actualStart}
                            onChange={(e) =>
                              updateProgressRow(
                                index,
                                "actualStart",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            type="date"
                            value={row.actualFinish}
                            onChange={(e) =>
                              updateProgressRow(
                                index,
                                "actualFinish",
                                e.target.value
                              )
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button
                type="button"
                className="w-full"
                size="lg"
                onClick={handleSubmitProgress}
                disabled={loading}
              >
                {loading
                  ? "Analyzing Progress..."
                  : "Analyze Progress (S-Curves & Metrics)"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* S-CURVE & METRICS */}
        {(sCurveData && sCurveLayout) || metrics ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-[2fr,1fr]">
            <Card>
              <CardHeader>
                <CardTitle>Performance S-Curve</CardTitle>
                <CardDescription>
                  Planned Value (PV), Earned Value (EV), and Actual Cost (AC)
                  over time (as computed by the backend).
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sCurveData && sCurveLayout ? (
                  <div className="w-full h-[320px] md:h-[380px]">
                    <Plot
                      data={sCurveData}
                      layout={{
                        ...sCurveLayout,
                        autosize: true,
                      }}
                      style={{ width: "100%", height: "100%" }}
                      useResizeHandler
                      config={{ responsive: true, displaylogo: false }}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-red-500">
                    S-curve data not available.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Schedule and cost performance indicators from the analysis
                  endpoint.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {metrics ? (
                  <>
                    {"schedule_variance" in metrics && (
                      <p>
                        <span className="font-semibold">Schedule Variance:</span>{" "}
                        {typeof metrics.schedule_variance === "number"
                          ? `$${metrics.schedule_variance.toLocaleString()}`
                          : "N/A"}
                      </p>
                    )}
                    {"cost_variance" in metrics && (
                      <p>
                        <span className="font-semibold">Cost Variance:</span>{" "}
                        {typeof metrics.cost_variance === "number"
                          ? `$${metrics.cost_variance.toLocaleString()}`
                          : "N/A"}
                      </p>
                    )}
                    {"critical_path" in metrics && metrics.critical_path && (
                      <p>
                        <span className="font-semibold">Critical Path:</span>{" "}
                        {metrics.critical_path}
                      </p>
                    )}
                    {"planned_finish" in metrics && metrics.planned_finish && (
                      <p>
                        <span className="font-semibold">Planned Finish:</span>{" "}
                        {metrics.planned_finish}
                      </p>
                    )}
                    {"schedule_performance_index" in metrics && (
                      <p>
                        <span className="font-semibold">SPI:</span>{" "}
                        {typeof metrics.schedule_performance_index === "number"
                          ? metrics.schedule_performance_index.toFixed(2)
                          : "N/A"}
                      </p>
                    )}
                    {"cost_performance_index" in metrics && (
                      <p>
                        <span className="font-semibold">CPI:</span>{" "}
                        {typeof metrics.cost_performance_index === "number"
                          ? metrics.cost_performance_index.toFixed(2)
                          : "N/A"}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Metrics will appear here after you analyze progress.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* INSIGHTS PANEL */}
        {insights && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Project Insights</CardTitle>
              <CardDescription>
                Quick interpretation of cost and schedule performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                {insights}
              </pre>
            </CardContent>
          </Card>
        )}
      </section>

      {/* FULLSCREEN GANTT MODAL */}
      {ganttFullscreenOpen && ganttData && ganttLayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative w-[95vw] h-[90vh] rounded-2xl bg-background shadow-xl">
            <button
              type="button"
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border bg-background/80 hover:bg-background"
              onClick={() => setGanttFullscreenOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
            <div className="h-full w-full px-4 pb-4 pt-12">
              <Plot
                data={ganttData}
                layout={{
                  ...ganttLayout,
                  autosize: true,
                  height: undefined, // let container drive height
                  margin: { l: 150, r: 20, t: 80, b: 80 },
                }}
                style={{ width: "100%", height: "100%" }}
                useResizeHandler
                config={{
                  responsive: true,
                  displaylogo: false,
                  modeBarButtonsToRemove: ["toImage", "lasso2d", "select2d"],
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
