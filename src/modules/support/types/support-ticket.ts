export interface SupportTicket {
  _id: string;
  subject: string;
  description: string;
  priority: string;
  category: string;
  status: string;
  createdAt: string;
}

export interface NewTicketData {
  subject: string;
  description: string;
  priority: string;
  category: string;
}
