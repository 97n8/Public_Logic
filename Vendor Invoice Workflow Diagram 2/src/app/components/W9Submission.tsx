import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface W9SubmissionProps {
  onSuccess: () => void;
}

const DEPARTMENTS = [
  "Finance",
  "Operations",
  "IT",
  "HR",
  "Legal",
  "Marketing",
  "Facilities",
  "Other"
];

const BUSINESS_TYPES = [
  "Individual/Sole Proprietor",
  "C Corporation",
  "S Corporation",
  "Partnership",
  "LLC",
  "Other"
];

export function W9Submission({ onSuccess }: W9SubmissionProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vendorId: "",
    vendorName: "",
    businessType: "",
    taxId: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    department: "",
    submittedBy: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-75bb27b9/w9`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("W-9 form submitted successfully");
        setFormData({
          vendorId: "",
          vendorName: "",
          businessType: "",
          taxId: "",
          address: "",
          city: "",
          state: "",
          zip: "",
          department: "",
          submittedBy: ""
        });
        onSuccess();
      } else {
        toast.error("Failed to submit W-9: " + data.error);
      }
    } catch (error) {
      console.error("Error submitting W-9:", error);
      toast.error("An error occurred while submitting the W-9 form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>W-9 Form Submission</CardTitle>
        <CardDescription>
          Submit or refresh vendor W-9 information (annual refresh required)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vendorId">Vendor ID *</Label>
              <Input
                id="vendorId"
                required
                value={formData.vendorId}
                onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                placeholder="VEND-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendorName">Vendor Name *</Label>
              <Input
                id="vendorName"
                required
                value={formData.vendorName}
                onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                placeholder="Acme Corporation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type *</Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) => setFormData({ ...formData, businessType: value })}
              >
                <SelectTrigger id="businessType">
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID (EIN/SSN) *</Label>
              <Input
                id="taxId"
                required
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                placeholder="XX-XXXXXXX"
                type="password"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main Street"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Springfield"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="IL"
                maxLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code *</Label>
              <Input
                id="zip"
                required
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                placeholder="62701"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="submittedBy">Submitted By *</Label>
              <Input
                id="submittedBy"
                required
                value={formData.submittedBy}
                onChange={(e) => setFormData({ ...formData, submittedBy: e.target.value })}
                placeholder="Your name"
              />
            </div>
          </div>

          <div className="rounded-lg border-2 border-dashed p-6 text-center">
            <Upload className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              W-9 PDF upload (simulated for prototype)
            </p>
            <p className="text-xs text-muted-foreground">
              In production, signed W-9 forms would be uploaded here
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Submit W-9 Form"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
