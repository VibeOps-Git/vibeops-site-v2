# tracker.py

from flask import request, jsonify, session
import pandas as pd
import copy
import logging
import uuid
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

# ─── CPM HELPER FUNCTIONS ────────────────────────────────────────

def addSuccessors(activityList):
    """Adds an 'immediateSuccessor' list to each activity based on predecessors."""
    activity_dict = {activity["activityName"]: activity for activity in activityList}
    for activity in activityList:
        current_name = activity["activityName"]
        successors = []
        for other in activityList:
            if current_name in other.get("immediatePredecessor", []):
                successors.append(other["activityName"])
        activity["immediateSuccessor"] = successors


def addCalculationCols(activityList):
    """Adds placeholder columns (ES, EF, LS, LF, TF, FF, Critical) to each activity."""
    for activity in activityList:
        activity['ES'] = 0      # Early Start
        activity['EF'] = 0      # Early Finish
        activity['LS'] = 0      # Late Start
        activity['LF'] = 0      # Late Finish
        activity['TF'] = 0      # Total Float
        activity['FF'] = 0      # Free Float
        activity['Critical'] = False  # Is on the critical path?


def calculateEarlyDates(activityList):
    """
    Calculates ES (Early Start) and EF (Early Finish) for each activity.
    ES = max(EF of all predecessors) or 0 if none.
    EF = ES + duration.
    """
    activity_dict = {activity['activityName']: activity for activity in activityList}
    for activity in activityList:
        duration = activity.get('duration', 0)
        preds = activity.get('immediatePredecessor', [])
        if not preds:
            activity['ES'] = 0
        else:
            max_pred_ef = 0
            for p in preds:
                pred_act = activity_dict.get(p)
                if pred_act and 'EF' in pred_act:
                    max_pred_ef = max(max_pred_ef, pred_act['EF'])
                else:
                    logger.warning(f"Predecessor '{p}' not found or missing EF for '{activity['activityName']}'")
            activity['ES'] = max_pred_ef
        activity['EF'] = activity['ES'] + duration


def getProjectFinish(activityList):
    """Returns the maximum EF among all activities (project finish in days-from-start)."""
    if not activityList:
        return 0
    return max(a.get('EF', 0) for a in activityList)


def calculateLateDates(activityList):
    """
    Calculates LF (Late Finish) and LS (Late Start) for each activity.
    LF = project_finish if no successors, else min(LS of all successors).
    LS = LF - duration.
    """
    project_finish = getProjectFinish(activityList)
    activity_dict = {activity['activityName']: activity for activity in activityList}

    # Process in reverse order
    for activity in reversed(activityList):
        duration = activity.get('duration', 0)
        succs = activity.get('immediateSuccessor', [])
        if not succs:
            activity['LF'] = project_finish
        else:
            min_succ_ls = float('inf')
            for s in succs:
                succ_act = activity_dict.get(s)
                if succ_act and 'LS' in succ_act:
                    min_succ_ls = min(min_succ_ls, succ_act['LS'])
                else:
                    logger.warning(f"Successor '{s}' not found or missing LS for '{activity['activityName']}'")
            activity['LF'] = min_succ_ls
        activity['LS'] = activity['LF'] - duration


def calculateTF(activityList):
    """
    Calculates TF (Total Float) = LF - EF. Marks activity as Critical if TF <= 0.
    """
    for activity in activityList:
        ef = activity.get('EF', 0)
        lf = activity.get('LF', 0)
        tf = lf - ef
        if tf <= 0:
            activity['TF'] = 0
            activity['Critical'] = True
        else:
            activity['TF'] = tf
            activity['Critical'] = False


def calculateFF(activityList):
    """
    Calculates FF (Free Float) for each activity:
    If no successors, FF = TF.
    Otherwise, FF = min(ES of successors) - EF.
    """
    activity_dict = {activity['activityName']: activity for activity in activityList}
    for activity in activityList:
        ef = activity.get('EF', 0)
        succs = activity.get('immediateSuccessor', [])
        if not succs:
            activity['FF'] = activity.get('TF', 0)
        else:
            min_succ_es = float('inf')
            for s in succs:
                succ_act = activity_dict.get(s)
                if succ_act and 'ES' in succ_act:
                    min_succ_es = min(min_succ_es, succ_act['ES'])
                else:
                    logger.warning(f"Successor '{s}' not found or missing ES for '{activity['activityName']}'")
            ff = min_succ_es - ef
            activity['FF'] = max(0, ff)


def perform_cpm_analysis(activityList):
    """
    Wrapper to run full CPM:
     - add successors
     - add placeholder columns
     - calculate early dates
     - calculate late dates
     - calculate total float / critical flags
     - calculate free float
    Returns the annotated list.
    """
    # Validation: ensure each has activityName, duration, immediatePredecessor
    for t in activityList:
        if 'activityName' not in t or 'duration' not in t or 'immediatePredecessor' not in t:
            raise ValueError("Each task must have 'activityName', 'duration', and 'immediatePredecessor'.")

    addSuccessors(activityList)
    addCalculationCols(activityList)
    calculateEarlyDates(activityList)
    calculateLateDates(activityList)
    calculateTF(activityList)
    calculateFF(activityList)
    return activityList


# ─── HANDLER: /construction-tracker ──────────────────────────────
def handle_tracker_post():
    """
    POST /construction-tracker
    Expects JSON body:
      {
        "project_name": "My Project",
        "tasks": [
          {
            "activityName": "A",
            "start": "YYYY-MM-DD",
            "duration": int,
            "immediatePredecessor": [...],
            "crew": "...",
            "personnel": int,
            "equipment": int
          },
          …
        ]
      }
    Returns:
      {
        "gantt_data": { "data": […], "layout": {…} },
        "personnel_data": { "data": […], "layout": {…} },
        "equipment_data": { "data": […], "layout": {…} },
        "processed_tasks": [ {…with ES,EF,LS,LF,TF,FF,Critical…}, … ],
        "critical_path_activities": [ "TaskName1", "TaskName2", … ],
        "session_id": "uuid"
      }
    """
    try:
        data = request.get_json()
        project_name = data.get("project_name")
        tasks_input = data.get("tasks", [])

        # Basic validation
        if not project_name or not isinstance(tasks_input, list) or len(tasks_input) == 0:
            return jsonify({"error": "Missing project_name or tasks must be a non-empty list."}), 400

        # Validate each task has required fields
        for task in tasks_input:
            required_keys = ("activityName", "start", "duration", "personnel", "equipment")
            if not all(k in task for k in required_keys):
                return jsonify({
                    "error": f"Each task must contain {required_keys}. Missing in: {task}"
                }), 400
            if not isinstance(task["duration"], (int, float)) or task["duration"] <= 0:
                return jsonify({
                    "error": f"Task '{task.get('activityName')}' has invalid duration. Must be > 0."
                }), 400
            if not isinstance(task["personnel"], (int, float)) or task["personnel"] < 0:
                return jsonify({
                    "error": f"Task '{task.get('activityName')}' has invalid personnel count. Must be >= 0."
                }), 400
            if not isinstance(task["equipment"], (int, float)) or task["equipment"] < 0:
                return jsonify({
                    "error": f"Task '{task.get('activityName')}' has invalid equipment count. Must be >= 0."
                }), 400

        # Generate session ID
        session_id = str(uuid.uuid4())
        session["session_id"] = session_id

        # Deep‐copy and run CPM
        cpm_tasks = copy.deepcopy(tasks_input)
        try:
            cpm_result = perform_cpm_analysis(cpm_tasks)
        except ValueError as ve:
            return jsonify({"error": str(ve)}), 400
        except Exception as e:
            logger.error(f"CPM error: {e}", exc_info=True)
            return jsonify({"error": f"Internal CPM error: {e}"}), 500

        # Build DataFrame to compute start/end dates
        df = pd.DataFrame(tasks_input)
        df["start_dt"] = pd.to_datetime(df["start"], format="%Y-%m-%d", errors="coerce")
        if df["start_dt"].isnull().any():
            bad = df[df["start_dt"].isnull()][["activityName", "start"]]
            return jsonify({
                "error": f"One or more 'start' dates failed to parse: {bad.to_dict(orient='records')}"
            }), 400

        # Compute end date = start + duration - 1
        df["end_dt"] = df.apply(lambda row: row["start_dt"] + timedelta(days=int(row["duration"]) - 1), axis=1)

        # Map CPM results (ES, EF, Critical) back
        cpm_map = {task["activityName"]: task for task in cpm_result}
        df["ES"] = df["activityName"].map(lambda nm: cpm_map.get(nm, {}).get("ES", 0))
        df["EF"] = df["activityName"].map(lambda nm: cpm_map.get(nm, {}).get("EF", 0))
        df["Critical"] = df["activityName"].map(lambda nm: cpm_map.get(nm, {}).get("Critical", False))

        # Build hover text
        def make_hover(row):
            act = row["activityName"]
            s = row["start_dt"].strftime("%Y-%m-%d")
            e = row["end_dt"].strftime("%Y-%m-%d")
            dur = int(row["duration"])
            es = row["ES"]
            ef = cpm_map.get(act, {}).get("EF", 0)
            crit = "Yes" if row["Critical"] else "No"
            personnel = row["personnel"]
            equipment = row["equipment"]
            return (
                f"<b>{act}</b><br>"
                f"Start: {s}<br>"
                f"Finish: {e}<br>"
                f"Duration: {dur} days<br>"
                f"ES: {es}, EF: {ef}<br>"
                f"Personnel: {personnel}<br>"
                f"Equipment: {equipment}<br>"
                f"Critical: {crit}"
            )

        df["HoverText"] = df.apply(make_hover, axis=1)
        df["Color"] = df["Critical"].apply(lambda c: "#ff3333" if c else "#00ffcc")

        # Earliest start & offset
        earliest_start = df["start_dt"].min()
        df["ES_offset"] = df["ES"].astype(int)

        # Sort so earliest tasks are at bottom of y-axis
        df = df.sort_values(by=["start_dt", "duration"], ascending=[True, True])

        # ─── GANTT trace ─────────────────────────────────────────────────────────
        plot_data = [{
            "type": "bar",
            "x": df["duration"].tolist(),
            "y": df["activityName"].tolist(),
            "base": df["ES_offset"].tolist(),
            "orientation": "h",
            "marker": {"color": df["Color"].tolist()},
            "name": "Tasks",
            "hoverinfo": "text",
            "text": df["HoverText"].tolist()
        }]

        plot_layout = {
            "title": {
                "text": f"{project_name} Gantt Chart",
                "font": {
                    "family": "Orbitron, sans-serif",
                    "size": 24,
                    "color": "#00ffcc"
                },
                "x": 0.5, "xanchor": "center", "xref": "paper"
            },
            "xaxis": {
                "type": "linear",
                "title": {
                    "text": "Days from Start",
                    "font": {
                        "family": "Inter, sans-serif",
                        "size": 16,
                        "color": "#f2f2f2"
                    }
                },
                "showgrid": True,
                "gridcolor": "#444444",
                "zeroline": False,
                "linecolor": "#555555",
                "linewidth": 1,
                "tickfont": {
                    "family": "Inter, sans-serif",
                    "size": 12,
                    "color": "#cccccc"
                }
            },
            "yaxis": {
                "title": {
                    "text": "Tasks",
                    "font": {
                        "family": "Inter, sans-serif",
                        "size": 16,
                        "color": "#f2f2f2"
                    }
                },
                "autorange": "reversed",
                "categoryorder": "array",
                "categoryarray": df["activityName"].tolist(),
                "showgrid": True,
                "gridcolor": "#444444",
                "zeroline": False,
                "linecolor": "#555555",
                "linewidth": 1,
                "tickfont": {
                    "family": "Inter, sans-serif",
                    "size": 12,
                    "color": "#cccccc"
                },
                "ticklen": 5,
                "tickwidth": 1,
                "tickcolor": "#555555"
            },
            "showlegend": False,
            "margin": {"l": 150, "r": 20, "t": 80, "b": 80},
            "paper_bgcolor": "#1e1e1e",
            "plot_bgcolor": "#1e1e1e",
            "font": {"color": "#f2f2f2"},
            "height": max(400, len(df) * 40)
        }

        # ─── RESOURCE USAGE CALCULATION ─────────────────────────────────────────
        project_duration_days = max(int(a["EF"]) for a in cpm_result)
        timeline_dates = [
            earliest_start + timedelta(days=i)
            for i in range(project_duration_days + 1)
        ]

        personnel_values = [0] * len(timeline_dates)
        equipment_values = [0] * len(timeline_dates)

        for _, row in df.iterrows():
            task_start = row["start_dt"]
            task_duration = int(row["duration"])
            task_personnel = int(row["personnel"])
            task_equipment = int(row["equipment"])

            task_end = task_start + timedelta(days=task_duration - 1)
            for i, day in enumerate(timeline_dates):
                if task_start <= day <= task_end:
                    personnel_values[i] += task_personnel
                    equipment_values[i] += task_equipment

        x_iso = [d.strftime("%Y-%m-%d") for d in timeline_dates]

        trace_personnel = {
            "x": x_iso,
            "y": personnel_values,
            "type": "bar",
            "name": "Personnel",
            "marker": {"color": "#00ffcc"},
            "hoverinfo": "x+y",
            "text": [str(v) for v in personnel_values],
            "textposition": "auto"
        }

        trace_equipment = {
            "x": x_iso,
            "y": equipment_values,
            "type": "bar",
            "name": "Equipment",
            "marker": {"color": "#ff3333"},
            "hoverinfo": "x+y",
            "text": [str(v) for v in equipment_values],
            "textposition": "auto"
        }

        # ─── PERSONNEL HISTOGRAM LAYOUT ─────────────────────────────────────────
        personnel_layout = {
            "title": {
                "text": "Personnel Usage Over Time",
                "font": {
                    "family": "Orbitron, sans-serif",
                    "size": 22,
                    "color": "#00ffcc"
                },
                "x": 0.5, "xanchor": "center"
            },
            "xaxis": {
                "type": "date",
                "title": {
                    "text": "Date",
                    "font": {
                        "family": "Inter, sans-serif",
                        "size": 14,
                        "color": "#f2f2f2"
                    }
                },
                "tickfont": {
                    "family": "Inter, sans-serif",
                    "size": 12,
                    "color": "#cccccc"
                },
                "gridcolor": "#444444",
                "zeroline": False,
                "linecolor": "#555555",
                "linewidth": 1
            },
            "yaxis": {
                "title": {
                    "text": "Personnel Count",
                    "font": {
                        "family": "Inter, sans-serif",
                        "size": 14,
                        "color": "#f2f2f2"
                    }
                },
                "tickfont": {
                    "family": "Inter, sans-serif",
                    "size": 12,
                    "color": "#cccccc"
                },
                "gridcolor": "#444444",
                "zeroline": False,
                "linecolor": "#555555",
                "linewidth": 1
            },
            "paper_bgcolor": "#1e1e1e",
            "plot_bgcolor": "#1e1e1e",
            "showlegend": False,
            "margin": {"l": 80, "r": 20, "t": 80, "b": 60},
            "font": {"color": "#f2f2f2"},
            "height": 300,
            "bargap": 0.1
        }

        # ─── EQUIPMENT HISTOGRAM LAYOUT ─────────────────────────────────────────
        equipment_layout = {
            "title": {
                "text": "Equipment Usage Over Time",
                "font": {
                    "family": "Orbitron, sans-serif",
                    "size": 22,
                    "color": "#ff3333"
                },
                "x": 0.5, "xanchor": "center"
            },
            "xaxis": {
                "type": "date",
                "title": {
                    "text": "Date",
                    "font": {
                        "family": "Inter, sans-serif",
                        "size": 14,
                        "color": "#f2f2f2"
                    }
                },
                "tickfont": {
                    "family": "Inter, sans-serif",
                    "size": 12,
                    "color": "#cccccc"
                },
                "gridcolor": "#444444",
                "zeroline": False,
                "linecolor": "#555555",
                "linewidth": 1
            },
            "yaxis": {
                "title": {
                    "text": "Equipment Count",
                    "font": {
                        "family": "Inter, sans-serif",
                        "size": 14,
                        "color": "#f2f2f2"
                    }
                },
                "tickfont": {
                    "family": "Inter, sans-serif",
                    "size": 12,
                    "color": "#cccccc"
                },
                "gridcolor": "#444444",
                "zeroline": False,
                "linecolor": "#555555",
                "linewidth": 1
            },
            "paper_bgcolor": "#1e1e1e",
            "plot_bgcolor": "#1e1e1e",
            "showlegend": False,
            "margin": {"l": 80, "r": 20, "t": 80, "b": 60},
            "font": {"color": "#f2f2f2"},
            "height": 300,
            "bargap": 0.1
        }

        # Collect critical path activities
        critical_activities = [
            task["activityName"]
            for task in cpm_result
            if task.get("Critical", False)
        ]

        return jsonify({
            "gantt_data": {
                "data": plot_data,
                "layout": plot_layout
            },
            "personnel_data": {
                "data": [trace_personnel],
                "layout": personnel_layout
            },
            "equipment_data": {
                "data": [trace_equipment],
                "layout": equipment_layout
            },
            "processed_tasks": cpm_result,
            "critical_path_activities": critical_activities,
            "session_id": session_id
        }), 200

    except Exception as e:
        logger.error(f"Error in handle_tracker_post: {e}", exc_info=True)
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500



# ─── HANDLER: /construction-tracker-progress ───────────────────────

def handle_progress_post():
    """
    POST /construction-tracker-progress
    Expects JSON body:
      {
        "tasks": [ …same structure as above… ],
        "progress": [
          {
            "taskIndex": 0,
            "percentComplete": float,     # e.g. 50.0
            "budgetedCost": float,        # e.g. 1200.0
            "actualCost": float,          # e.g. 900.0
            "actualStart": "YYYY-MM-DD" or "",
            "actualFinish": "YYYY-MM-DD" or ""
          },
          …
        ],
        "report_date": "YYYY-MM-DD"
      }
    Returns:
      {
        "s_curve_data": { "data": […3 traces…], "layout": {…} },
        "metrics": {
          "schedule_variance": …,
          "cost_variance": …,
          "schedule_performance_index": …,
          "cost_performance_index": …,
          "critical_path": […],
          "planned_finish": "YYYY-MM-DD",
          "report_date": "YYYY-MM-DD"
        }
      }
    """
    try:
        data = request.get_json()
        tasks_input = data.get("tasks", [])
        progress_input = data.get("progress", [])
        report_date_str = data.get("report_date", "")

        # Basic validation
        if not isinstance(tasks_input, list) or not isinstance(progress_input, list):
            return jsonify({"error": "'tasks' and 'progress' must be arrays."}), 400
        if not report_date_str:
            return jsonify({"error": "Missing 'report_date'."}), 400

        # Parse report_date
        try:
            report_date = datetime.strptime(report_date_str, "%Y-%m-%d")
        except ValueError:
            return jsonify({"error": f"Invalid report_date format: {report_date_str}. Use YYYY-MM-DD."}), 400

        # Re-run CPM on tasks_input to retrieve EF and critical path
        cpm_tasks = copy.deepcopy(tasks_input)
        try:
            cpm_result = perform_cpm_analysis(cpm_tasks)
        except Exception as e:
            logger.error(f"Error re-running CPM in handle_progress_post: {e}", exc_info=True)
            return jsonify({"error": f"Unable to recalculate CPM: {str(e)}"}), 500

        # Build a lookup for CPM by activityName
        cpm_map = {task["activityName"]: task for task in cpm_result}

        # Build DataFrame of planned tasks for earliest_start
        df_planned = pd.DataFrame(tasks_input)
        df_planned["start_dt"] = pd.to_datetime(df_planned["start"], format="%Y-%m-%d", errors="coerce")
        if df_planned["start_dt"].isnull().any():
            bad = df_planned[df_planned["start_dt"].isnull()][["activityName", "start"]]
            return jsonify({
                "error": f"One or more planned 'start' dates failed to parse: {bad.to_dict(orient='records')}"
            }), 400

        earliest_start = df_planned["start_dt"].min()
        project_duration_days = max(int(a["EF"]) for a in cpm_result)
        planned_finish_date = earliest_start + timedelta(days=project_duration_days - 1)

        timeline_days = (planned_finish_date - earliest_start).days + 1
        timeline_dates = [earliest_start + timedelta(days=i) for i in range(timeline_days)]

        # Convert progress_input into DataFrame
        df_progress = pd.DataFrame(progress_input)

        # Join planned + progress info
        joined = []
        for idx, t in enumerate(tasks_input):
            # Find matching progress row
            prog_rows = df_progress[df_progress["taskIndex"] == idx]
            if prog_rows.empty:
                return jsonify({"error": f"No progress found for taskIndex={idx}"}), 400
            prog = prog_rows.iloc[0].to_dict()

            planned_start = datetime.strptime(t["start"], "%Y-%m-%d")
            planned_duration = int(t["duration"])
            pct = float(prog.get("percentComplete", 0.0)) / 100.0
            budgeted = float(prog.get("budgetedCost", 0.0))
            actual_cost = float(prog.get("actualCost", 0.0))

            actual_start_dt = None
            actual_finish_dt = None
            as_str = prog.get("actualStart", "")
            af_str = prog.get("actualFinish", "")
            if as_str:
                try:
                    actual_start_dt = datetime.strptime(as_str, "%Y-%m-%d")
                except ValueError:
                    return jsonify({"error": f"Invalid actualStart for taskIndex={idx}: {as_str}"}), 400
            if af_str:
                try:
                    actual_finish_dt = datetime.strptime(af_str, "%Y-%m-%d")
                except ValueError:
                    return jsonify({"error": f"Invalid actualFinish for taskIndex={idx}: {af_str}"}), 400

            joined.append({
                "activityName": t["activityName"],
                "planned_start": planned_start,
                "planned_duration": planned_duration,
                "budgetedCost": budgeted,
                "percentComplete": pct,
                "actualCost": actual_cost,
                "actual_start": actual_start_dt,
                "actual_finish": actual_finish_dt
            })

        # Build PV, EV, AC arrays
        pv_values = []
        ev_values = []
        ac_values = []

        for day in timeline_dates:
            pv_day = 0.0
            ev_day = 0.0
            ac_day = 0.0

            for j in joined:
                ps = j["planned_start"]
                planned_duration = j["planned_duration"]
                bc = j["budgetedCost"]
                pct = j["percentComplete"]
                as_dt = j["actual_start"]
                af_dt = j["actual_finish"]
                ac = j["actualCost"]

                # PV calculation
                if day < ps:
                    pv_contrib = 0.0
                else:
                    days_into = (day - ps).days + 1
                    frac_planned = min(1.0, float(days_into) / float(planned_duration))
                    pv_contrib = bc * frac_planned
                pv_day += pv_contrib

                # EV calculation
                if as_dt is None or day < as_dt:
                    ev_contrib = 0.0
                elif af_dt is not None and day >= af_dt:
                    ev_contrib = bc  # 100% earned
                elif day > report_date:
                    ev_contrib = None  # will cap later
                else:
                    ev_total_task = bc * pct
                    days_to_report = max(1, (report_date - as_dt).days + 1)
                    days_into_ev = (day - as_dt).days + 1
                    frac_ev = min(1.0, float(days_into_ev) / float(days_to_report))
                    ev_contrib = ev_total_task * frac_ev
                ev_day += (ev_contrib if ev_contrib is not None else 0.0)

                # AC calculation
                if as_dt is None or day < as_dt:
                    ac_contrib = 0.0
                elif af_dt is not None and day >= af_dt:
                    ac_contrib = ac
                elif day > report_date:
                    ac_contrib = None  # will cap later
                else:
                    days_to_report_ac = max(1, (report_date - as_dt).days + 1)
                    days_into_ac = (day - as_dt).days + 1
                    frac_ac = min(1.0, float(days_into_ac) / float(days_to_report_ac))
                    ac_contrib = ac * frac_ac
                ac_day += (ac_contrib if ac_contrib is not None else 0.0)

            pv_values.append(pv_day)
            ev_values.append(ev_day)
            ac_values.append(ac_day)

        # Cap EV and AC after report_date so they remain flat
        if report_date < earliest_start:
            idx_report = -1
        else:
            idx_report = (report_date - earliest_start).days
            if idx_report >= len(timeline_dates):
                idx_report = len(timeline_dates) - 1

        ev_report = ev_values[idx_report]
        ac_report = ac_values[idx_report]

        for i in range(idx_report + 1, len(timeline_dates)):
            ev_values[i] = ev_report
            ac_values[i] = ac_report

        # Prepare Plotly traces
        x_iso = [d.strftime("%Y-%m-%d") for d in timeline_dates]

        trace_pv = {
            "x": x_iso,
            "y": pv_values,
            "mode": "lines+markers",
            "name": "Planned Value (PV)",
            "line": {"color": "#00ffcc", "width": 2},
            "hoverinfo": "x+y"
        }
        trace_ac = {
            "x": x_iso,
            "y": ac_values,
            "mode": "lines+markers",
            "name": "Actual Cost (AC)",
            "line": {"color": "#ff3333", "width": 2},
            "hoverinfo": "x+y"
        }
        trace_ev = {
            "x": x_iso,
            "y": ev_values,
            "mode": "lines+markers",
            "name": "Earned Value (EV)",
            "line": {"color": "#4444ff", "width": 2},
            "hoverinfo": "x+y"
        }

        pv_at_report = pv_values[idx_report]
        ev_at_report = ev_report
        ac_at_report = ac_report

        schedule_variance = ev_at_report - pv_at_report
        cost_variance = ev_at_report - ac_at_report
        spi = (ev_at_report / pv_at_report) if pv_at_report != 0 else (float("inf") if ev_at_report > 0 else 0.0)
        cpi = (ev_at_report / ac_at_report) if ac_at_report != 0 else (float("inf") if ev_at_report > 0 else 0.0)

        critical_activities = [
            a["activityName"] for a in cpm_result if a.get("Critical", False)
        ]

        # Build layout for S-curve
        s_curve_layout = {
            "title": {
                "text": f"S-Curve (PV / AC / EV) as of {report_date.strftime('%Y-%m-%d')}",
                "font": {"family": "Orbitron, sans-serif", "size": 22, "color": "#00ffcc"},
                "x": 0.5, "xanchor": "center"
            },
            "xaxis": {
                "type": "date",
                "title": {
                    "text": "Date",
                    "font": {"family": "Inter, sans-serif", "size": 14, "color": "#f2f2f2"}
                },
                "tickfont": {"family": "Inter, sans-serif", "size": 12, "color": "#cccccc"},
                "gridcolor": "#444444",
                "zeroline": False,
                "linecolor": "#555555",
                "linewidth": 1
            },
            "yaxis": {
                "title": {
                    "text": "Cost ($)",
                    "font": {"family": "Inter, sans-serif", "size": 14, "color": "#f2f2f2"}
                },
                "tickfont": {"family": "Inter, sans-serif", "size": 12, "color": "#cccccc"},
                "gridcolor": "#444444",
                "zeroline": False,
                "linecolor": "#555555",
                "linewidth": 1
            },
            "paper_bgcolor": "#1e1e1e",
            "plot_bgcolor": "#1e1e1e",
            "legend": {
                "font": {"size": 12, "color": "#f2f2f2"},
                "bgcolor": "rgba(30,30,30,0.5)",
                "bordercolor": "#444444",
                "borderwidth": 1
            },
            "margin": {"l": 80, "r": 20, "t": 80, "b": 60},
            "font": {"color": "#f2f2f2"},
            "height": 400
        }

        return jsonify({
            "s_curve_data": {
                "data": [trace_pv, trace_ac, trace_ev],
                "layout": s_curve_layout
            },
            "metrics": {
                "schedule_variance": round(schedule_variance, 2),
                "cost_variance": round(cost_variance, 2),
                "schedule_performance_index": round(spi, 3),
                "cost_performance_index": round(cpi, 3),
                "critical_path": critical_activities,
                "planned_finish": planned_finish_date.strftime("%Y-%m-%d"),
                "report_date": report_date.strftime("%Y-%m-%d")
            }
        }), 200

    except Exception as e:
        logger.error(f"Error in handle_progress_post: {e}", exc_info=True)
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
