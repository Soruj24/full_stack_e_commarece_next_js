"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, ArrowLeft, Loader2, Check, MapPin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useVendorRegistration } from "@/modules/vendor/hooks/use-vendor-registration";

export default function VendorRegistrationPage() {
  const router = useRouter();
  const { loading, checking, existingVendor, formData, handleChange, handleSubmit } = useVendorRegistration();

  if (checking) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  }

  if (existingVendor) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="text-center">
            <CardContent className="pt-12 pb-8">
              <div className={cn("w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center",
                existingVendor.status === "approved" ? "bg-green-100" : existingVendor.status === "pending" ? "bg-yellow-100" : "bg-red-100")}>
                {existingVendor.status === "approved" ? <Check className="w-8 h-8 text-green-600" /> :
                 existingVendor.status === "pending" ? <Loader2 className="w-8 h-8 text-yellow-600 animate-spin" /> :
                 <Store className="w-8 h-8 text-red-600" />}
              </div>
              <h2 className="text-2xl font-bold mb-2">{existingVendor.storeName}</h2>
              <p className="text-muted-foreground mb-6">
                {existingVendor.status === "approved" && "Your vendor account is active!"}
                {existingVendor.status === "pending" && "Your application is under review."}
                {existingVendor.status === "rejected" && "Your application was rejected."}
                {existingVendor.status === "suspended" && "Your vendor account is suspended."}
              </p>
              <Button asChild><Link href="/vendor/dashboard">Go to Dashboard</Link></Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="w-4 h-4" />Back to Home</Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"><Store className="w-8 h-8 text-primary" /></div>
          <h1 className="text-3xl font-bold mb-2">Become a Vendor</h1>
          <p className="text-muted-foreground">Start selling your products on our marketplace</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader><CardTitle className="flex items-center gap-2"><Store className="w-5 h-5" />Store Information</CardTitle><CardDescription>Tell us about your store</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name *</Label>
                  <Input id="storeName" placeholder="My Awesome Store" value={formData.storeName} onChange={(e) => handleChange("storeName", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea id="storeDescription" placeholder="Describe your store..." value={formData.storeDescription} onChange={(e) => handleChange("storeDescription", e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader><CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5" />Contact Information</CardTitle><CardDescription>How can we reach you?</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email *</Label>
                    <Input id="contactEmail" type="email" placeholder="vendor@example.com" value={formData.contactEmail} onChange={(e) => handleChange("contactEmail", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input id="contactPhone" type="tel" placeholder="+1 234 567 8900" value={formData.contactPhone} onChange={(e) => handleChange("contactPhone", e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5" />Business Address</CardTitle><CardDescription>Where is your business located?</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input id="street" placeholder="123 Main St" value={formData.street} onChange={(e) => handleChange("street", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2"><Label htmlFor="city">City</Label><Input id="city" placeholder="New York" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} /></div>
                  <div className="space-y-2"><Label htmlFor="state">State</Label><Input id="state" placeholder="NY" value={formData.state} onChange={(e) => handleChange("state", e.target.value)} /></div>
                  <div className="space-y-2"><Label htmlFor="zipCode">ZIP Code</Label><Input id="zipCode" placeholder="10001" value={formData.zipCode} onChange={(e) => handleChange("zipCode", e.target.value)} /></div>
                  <div className="space-y-2"><Label htmlFor="country">Country</Label><Input id="country" placeholder="USA" value={formData.country} onChange={(e) => handleChange("country", e.target.value)} /></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Submit Application</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
