import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function PipelineEstimator() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [formData, setFormData] = useState({
    length: '',
    diameter: '',
    terrain: 'flat',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.estimatePipeline(formData);
      const data = await response.json();
      
      if (response.ok) {
        setResults(data);
        toast.success('Estimate calculated successfully!');
      } else {
        toast.error(data.error || 'Failed to calculate estimate');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <section className="max-w-5xl mx-auto">
        <h1 className="section-title text-center">Pipeline Cost Estimator</h1>
        <p className="section-text text-center">
          Calculate pipeline construction costs and bill of materials
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Project Parameters</CardTitle>
              <CardDescription>
                Enter your pipeline specifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="length">Length (km)</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.01"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                    required
                    placeholder="e.g., 10.5"
                  />
                </div>

                <div>
                  <Label htmlFor="diameter">Diameter (inches)</Label>
                  <Input
                    id="diameter"
                    type="number"
                    step="0.1"
                    value={formData.diameter}
                    onChange={(e) => setFormData({ ...formData, diameter: e.target.value })}
                    required
                    placeholder="e.g., 30"
                  />
                </div>

                <div>
                  <Label htmlFor="terrain">Terrain Type</Label>
                  <Select 
                    value={formData.terrain} 
                    onValueChange={(value) => setFormData({ ...formData, terrain: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="hilly">Hilly</SelectItem>
                      <SelectItem value="mountainous">Mountainous</SelectItem>
                      <SelectItem value="swampy">Swampy</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-2">
                    Terrain affects labor and ROW costs
                  </p>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Calculating...' : 'Calculate Estimate'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {results && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                  <CardDescription>Estimated project costs (2025)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Material Cost:</span>
                    <span className="font-semibold">{formatCurrency(results.cost.material_cost)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Labor Cost:</span>
                    <span className="font-semibold">{formatCurrency(results.cost.labor_cost)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">ROW Cost:</span>
                    <span className="font-semibold">{formatCurrency(results.cost.row_cost)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Misc Cost:</span>
                    <span className="font-semibold">{formatCurrency(results.cost.misc_cost)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 text-lg">
                    <span className="font-bold">Total Cost:</span>
                    <span className="font-bold text-primary">{formatCurrency(results.cost.total_cost)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bill of Materials</CardTitle>
                  <CardDescription>Estimated material requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(results.bom).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center pb-2 border-b">
                      <span className="text-muted-foreground capitalize">{key.replace('_', ' ')}:</span>
                      <span className="font-semibold">{value as string}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
