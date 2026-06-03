import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ExistingVendor {
  _id: string;
  storeName: string;
  status: string;
}

interface VendorFormData {
  storeName: string;
  storeDescription: string;
  contactEmail: string;
  contactPhone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const initialFormData: VendorFormData = {
  storeName: "", storeDescription: "", contactEmail: "", contactPhone: "",
  street: "", city: "", state: "", zipCode: "", country: "",
};

export function useVendorRegistration() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [existingVendor, setExistingVendor] = useState<ExistingVendor | null>(null);
  const [formData, setFormData] = useState<VendorFormData>(initialFormData);

  useEffect(() => {
    const checkVendor = async () => {
      try {
        const res = await fetch("/api/vendors");
        const data = await res.json();
        if (data.success && data.vendors?.length > 0) setExistingVendor(data.vendors[0]);
      } catch { /* no vendor */ }
      finally { setChecking(false); }
    };
    checkVendor();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.storeName || !formData.contactEmail) {
      toast.error("Please fill in required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          address: { street: formData.street, city: formData.city, state: formData.state, zipCode: formData.zipCode, country: formData.country },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit application");
      toast.success("Application submitted! We'll review it soon.");
      router.push("/vendor/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally { setLoading(false); }
  };

  return { loading, checking, existingVendor, formData, handleChange, handleSubmit };
}
