"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Search,
  Download,
} from "lucide-react";
import { User } from '@/lib/types';
import { exportToCSV } from "@/lib/export-utils";
import { UserRow } from "./UserRow";

interface UserTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onChangeRole: (userId: string, newRole: string) => void;
  onUpdateStatus: (userId: string, newStatus: string) => void;
  onDelete: (userId: string) => void;
  onClearSearch: () => void;
}

export function UserTable({
  users,
  loading,
  onEdit,
  onChangeRole,
  onUpdateStatus,
  onDelete,
  onClearSearch,
}: UserTableProps) {
  const handleExport = () => {
    const headers = ["Name","Email","Designation","Phone","Location","Website","Role","Status","Verified","Joined Date"];
    const rows = (users || []).map((user) => [
      user.name, user.email, user.designation||"", user.phoneNumber||"",
      user.location||"", user.website||"", user.role, user.status,
      user.isVerified ? "Yes" : "No", new Date(user.createdAt).toLocaleDateString(),
    ]);
    exportToCSV(headers, rows, "users_report");
  };

  return (
    <div className="space-y-4">
      <div className="px-8 py-4 flex justify-end">
        <Button onClick={handleExport} variant="outline"
          className="rounded-xl font-bold gap-2 border-border hover:bg-muted text-muted-foreground"
          disabled={users.length === 0 || loading}>
          <Download className="h-4 w-4" />Export CSV
        </Button>
      </div>
      <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="font-bold text-muted-foreground py-4">User</TableHead>
            <TableHead className="font-bold text-muted-foreground">Designation</TableHead>
            <TableHead className="font-bold text-muted-foreground">Role</TableHead>
            <TableHead className="font-bold text-muted-foreground">Status</TableHead>
            <TableHead className="font-bold text-muted-foreground">Verified</TableHead>
            <TableHead className="font-bold text-muted-foreground">Joined Date</TableHead>
            <TableHead className="text-right font-bold text-muted-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-20">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-muted-foreground font-bold tracking-tight">Syncing user data...</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (users || []).length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-20">
                <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                  <Search className="h-10 w-10 opacity-20" />
                  <p className="font-medium text-lg">No users matching your search.</p>
                  <Button variant="link" onClick={onClearSearch} className="text-primary">Clear search</Button>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            (users || []).map((user) => (
              <UserRow key={user._id} user={user} onEdit={onEdit} onChangeRole={onChangeRole} onUpdateStatus={onUpdateStatus} onDelete={onDelete} />
            ))
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
