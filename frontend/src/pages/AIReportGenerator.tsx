import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Loader2 } from 'lucide-react';

export default function AIReportGenerator() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reportType: 'engineering_feasibility',
    companyName: '',
    industry: '',
    budgetRange: '',
    projectContext: '',
    includeAIAnalysis: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.generateReport(formData);
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Report generated successfully! Download will start shortly.');
        // Handle file download
        if (data.download_url) {
          window.location.href = data.download_url;
        }
      } else {
        toast.error(data.error || 'Failed to generate report');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <section className="max-w-5xl mx-auto">
        <h1 className="section-title text-center">AI Report Generator</h1>
        <p className="section-text text-center">
          Generate professional capital planning and engineering reports with AI assistance
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Report Configuration</CardTitle>
                <CardDescription>
                  Fill in the details below to generate your custom report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="reportType">Report Type</Label>
                    <Select 
                      value={formData.reportType} 
                      onValueChange={(value) => setFormData({ ...formData, reportType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering_feasibility">Engineering Feasibility Study</SelectItem>
                        <SelectItem value="defense_compliance">Defense Compliance Report</SelectItem>
                        <SelectItem value="utilities_estimate">Utilities Infrastructure Estimate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      required
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      required
                      placeholder="e.g., Construction, Defense, Utilities"
                    />
                  </div>

                  <div>
                    <Label htmlFor="budgetRange">Budget Range</Label>
                    <Input
                      id="budgetRange"
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      required
                      placeholder="e.g., $1M - $5M"
                    />
                  </div>

                  <div>
                    <Label htmlFor="projectContext">Project Context</Label>
                    <Textarea
                      id="projectContext"
                      value={formData.projectContext}
                      onChange={(e) => setFormData({ ...formData, projectContext: e.target.value })}
                      required
                      placeholder="Describe your project, goals, and any specific requirements..."
                      rows={6}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeAI"
                      checked={formData.includeAIAnalysis}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, includeAIAnalysis: checked as boolean })
                      }
                    />
                    <Label htmlFor="includeAI" className="cursor-pointer">
                      Include AI-powered analysis and recommendations
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? 'Generating Report...' : 'Generate Report'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Report Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Professional Formatting</h4>
                  <p className="text-sm text-muted-foreground">
                    Reports include custom styling, headers, footers, and tables
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">AI-Powered Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Get intelligent recommendations based on industry best practices
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Instant Download</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive your report in DOCX format immediately after generation
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Customizable</h4>
                  <p className="text-sm text-muted-foreground">
                    Edit the generated report to fit your specific needs
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
