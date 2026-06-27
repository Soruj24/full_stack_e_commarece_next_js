
import { ContactInquiries } from "@/components/admin/dashboard/ContactInquiries";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface InquiriesTabContentProps {
  contactMessages: ContactMessage[];
  onDelete: (id: string) => void;
  onViewFull: (message: ContactMessage) => void;
}

export function InquiriesTabContent({
  contactMessages,
  onDelete,
  onViewFull,
}: InquiriesTabContentProps) {
  return (
    <ContactInquiries
      messages={contactMessages}
      onDelete={onDelete}
      onViewFull={onViewFull}
    />
  );
}
