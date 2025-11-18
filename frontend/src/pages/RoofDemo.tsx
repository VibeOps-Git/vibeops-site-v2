import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function RoofDemo() {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [roofSize, setRoofSize] = useState('');
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('address', address);
      formData.append('roof_size', roofSize);

      const response = await api.calculateRoofCost(formData);
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
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <section className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="section-title">VibeOps Roofing Estimator</h1>
          <div className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-lg font-bold mb-4">
            DEMO
          </div>
          <p className="section-text">
            A Sales Demo for Roofing Companies — Powered by VibeOps
          </p>
        </div>

        <Card className="mb-8 bg-accent/10 border-accent">
          <CardContent className="pt-6">
            <p className="text-center mb-4">
              <strong>Welcome to the VibeOps Roofing Estimator Demo!</strong>
            </p>
            <p className="text-center text-muted-foreground">
              This interactive demo shows how VibeOps can help your roofing company win more jobs and close deals faster. 
              We customize and tune this estimator for your business, using your real unit costs, labor rates, and branding.
            </p>
            <p className="text-center text-muted-foreground mt-4">
              Ready to see your own branded estimator? <strong>Contact VibeOps</strong> for a full white-label version tailored to your workflow.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
              <CardDescription>
                Enter the property address and roof area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="address">Property Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    placeholder="1234 West Broadway, Vancouver, BC"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Enter a complete address in Canada or the US
                  </p>
                </div>

                <div>
                  <Label htmlFor="roofSize">Roof Size (sq ft)</Label>
                  <Input
                    id="roofSize"
                    type="number"
                    step="0.01"
                    value={roofSize}
                    onChange={(e) => setRoofSize(e.target.value)}
                    required
                    placeholder="e.g., 2500"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Measured roof area in square feet
                  </p>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Calculating...' : 'Calculate Cost'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>How This Demo Works</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="font-bold text-primary mr-2">1.</span>
                    <span>Type an address and enter the roof area in square feet</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-primary mr-2">2.</span>
                    <span>Click <strong>Calculate Cost</strong> to see a sample estimate and bill of materials</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-primary mr-2">3.</span>
                    <span>The estimate includes materials, labor, and total project cost</span>
                  </li>
                </ol>

                <div className="bg-accent/20 border border-accent rounded-lg p-4 mt-6">
                  <p className="font-semibold text-accent mb-2">DEMO ONLY</p>
                  <p className="text-sm text-muted-foreground">
                    This is a sample estimator. VibeOps will tune, brand, and connect this tool to your real unit costs, labor rates, and workflow for your company.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {results && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Estimate Results</CardTitle>
              <CardDescription>
                {results.address}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between pb-2 border-b">
                    <span className="text-muted-foreground">Roof Area:</span>
                    <span className="font-semibold">{results.roof_size?.toFixed(2)} sq ft</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b text-lg">
                    <span className="font-bold">Total Cost:</span>
                    <span className="font-bold text-primary">{formatCurrency(results.total_cost)}</span>
                  </div>
                </div>
              </div>

              {results.bill_of_materials && (
                <div>
                  <h3 className="font-semibold mb-4">Bill of Materials</h3>
                  <div className="space-y-2">
                    {Object.entries(results.bill_of_materials).map(([item, quantity]) => (
                      <div key={item} className="flex justify-between pb-2 border-b">
                        <span className="text-muted-foreground capitalize">{item.replace('_', ' ')}:</span>
                        <span className="font-semibold">{quantity as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
