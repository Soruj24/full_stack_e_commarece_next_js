import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ContactFormProps {
  formData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    userId?: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    subject: string;
    message: string;
    userId?: string;
  }>>;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function ContactForm({
  formData,
  setFormData,
  handleSubmit,
  loading,
}: ContactFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">
            Identity Name
          </Label>
          <Input
            required
            placeholder="ENTER FULL NAME"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="h-16 bg-muted/30 border border-border/40 rounded-2xl px-6 font-bold text-foreground focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all uppercase text-[11px] tracking-widest"
          />
        </div>
        <div className="space-y-4">
          <Label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">
            Endpoint Address
          </Label>
          <Input
            required
            type="email"
            placeholder="IDENTITY@DOMAIN.COM"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="h-16 bg-muted/30 border border-border/40 rounded-2xl px-6 font-bold text-foreground focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all uppercase text-[11px] tracking-widest"
          />
        </div>
      </div>
      <div className="space-y-4">
        <Label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">
          Inquiry Protocol
        </Label>
        <Input
          required
          placeholder="SUBJECT OF TRANSMISSION"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="h-16 bg-muted/30 border border-border/40 rounded-2xl px-6 font-bold text-foreground focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all uppercase text-[11px] tracking-widest"
        />
      </div>
      <div className="space-y-4">
        <Label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-1">
          Transmission Payload
        </Label>
        <Textarea
          required
          placeholder="ENTER DETAILED LOGS OR INQUIRY..."
          rows={6}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="bg-muted/30 border border-border/40 rounded-[32px] p-8 font-bold text-foreground focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all min-h-[240px] uppercase text-[11px] tracking-widest leading-relaxed"
        />
      </div>
      <Button
        type="submit"
        loading={loading}
        className="w-full md:w-auto h-16 px-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.05] active:scale-[0.95] gap-4"
      >
        <Send className="h-4 w-4" />
        Execute Transmission
      </Button>
    </form>
  );
}
