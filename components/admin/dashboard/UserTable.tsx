"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Settings,
  ShieldAlert,
  Ban,
  CheckCircle,
  Mail,
  Calendar,
  Search,
  Trash2,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { User } from "@/types";

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
  const exportToCSV = () => {
    const headers = ["Name", "Email", "Designation", "Phone", "Location", "Website", "Role", "Status", "Verified", "Joined Date"];
    const csvData = (users || []).map((user) => [
      user.name,
      user.email,
      user.designation || "",
      user.phoneNumber || "",
      user.location || "",
      user.website || "",
      user.role,
      user.status,
      user.isVerified ? "Yes" : "No",
      new Date(user.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...csvData.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `users_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="px-8 py-4 flex justify-end">
        <Button
          onClick={exportToCSV}
          variant="outline"
          className="rounded-xl font-bold gap-2 border-border hover:bg-muted text-muted-foreground"
          disabled={users.length === 0 || loading}
        >
          <Download className="h-4 w-4" />
          Export CSV
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
                  <Button variant="link" onClick={onClearSearch} className="text-primary">
                    Clear search
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            (users || []).map((user) => (
              <TableRow
                key={user._id}
                className="hover:bg-primary/5 border-border transition-all group"
              >
                <TableCell className="py-5">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary shadow-sm transition-transform group-hover:scale-105">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 shadow-sm">
                          <CheckCircle className="h-4 w-4 text-emerald-500 fill-emerald-500/10" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {user.name}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-bold text-muted-foreground/80 group-hover:text-primary/80 transition-colors">
                    {user.designation || "Not specified"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-xl px-3 py-1 font-bold uppercase tracking-wider text-[10px] border-2",
                      user.role === "admin"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : user.role === "vendor"
                        ? "bg-indigo-500/10 text-indigo-600 border-indigo-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "rounded-full px-3 py-1 font-bold text-[11px] shadow-sm",
                      user.status === "active"
                        ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none dark:text-emerald-400"
                        : "bg-destructive/10 text-destructive hover:bg-destructive/20 border-none"
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full mr-2",
                        user.status === "active" ? "bg-emerald-500" : "bg-destructive"
                      )}
                    />
                    {user.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.isVerified ? (
                      <Badge
                        variant="outline"
                        className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 rounded-lg px-2 py-0.5 text-[10px] font-bold dark:text-emerald-400"
                      >
                        VERIFIED
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-orange-500/10 text-orange-600 border-orange-500/20 rounded-lg px-2 py-0.5 text-[10px] font-bold"
                      >
                        PENDING
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm text-muted-foreground">
                    <span className="font-medium text-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-10 w-10 p-0 rounded-xl hover:bg-muted transition-all"
                      >
                        <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 p-2 rounded-2xl shadow-2xl border-border bg-card"
                    >
                      <div className="px-2 py-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Manage User
                      </div>
                      <DropdownMenuItem
                        onClick={() => onEdit(user)}
                        className="rounded-xl py-3 gap-3 cursor-pointer"
                      >
                        <Settings className="h-4 w-4 text-primary" />
                        <span className="font-medium">Edit Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onChangeRole(user._id, "admin")
                        }
                        className={cn(
                          "rounded-xl py-3 gap-3 cursor-pointer",
                          user.role === "admin" && "bg-primary/5"
                        )}
                      >
                        <ShieldAlert className="h-4 w-4 text-primary" />
                        <span className="font-medium">Make Administrator</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onChangeRole(user._id, "vendor")
                        }
                        className={cn(
                          "rounded-xl py-3 gap-3 cursor-pointer",
                          user.role === "vendor" && "bg-primary/5"
                        )}
                      >
                        <Settings className="h-4 w-4 text-indigo-600" />
                        <span className="font-medium">Make Vendor</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onChangeRole(user._id, "user")
                        }
                        className={cn(
                          "rounded-xl py-3 gap-3 cursor-pointer",
                          user.role === "user" && "bg-primary/5"
                        )}
                      >
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Make Regular User</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onUpdateStatus(
                            user._id,
                            user.status === "active" ? "banned" : "active"
                          )
                        }
                        className="rounded-xl py-3 gap-3 cursor-pointer"
                      >
                        {user.status === "active" ? (
                          <>
                            <Ban className="h-4 w-4 text-destructive" />
                            <span className="font-medium text-destructive">Ban Account</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-600">
                              Activate Account
                            </span>
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-1 bg-border" />
                      <DropdownMenuItem
                        onClick={() => onDelete(user._id)}
                        className="rounded-xl py-3 gap-3 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="font-medium">Delete Permanently</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
