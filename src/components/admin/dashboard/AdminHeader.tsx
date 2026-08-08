import { Search, RefreshCw, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/ui/PageHeader";

interface AdminHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fetchUsers: () => void;
  loading: boolean;
  setIsInviteDialogOpen: (open: boolean) => void;
}

export function AdminHeader({
  searchQuery,
  setSearchQuery,
  fetchUsers,
  loading,
  setIsInviteDialogOpen,
}: AdminHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <PageHeader
        title="Dashboard"
        description="Manage users, monitor activity, and configure settings."
      />
      <div className="flex items-center gap-2 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 rounded-lg bg-muted/50 border-border/60 w-56 text-sm"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchUsers}
          disabled={loading}
          className="h-9 w-9 rounded-lg border-border/60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        </Button>
        <Button
          onClick={() => setIsInviteDialogOpen(true)}
          className="h-9 rounded-lg text-sm font-medium px-4"
        >
          <UserPlus className="mr-1.5 h-3.5 w-3.5" />
          Invite
        </Button>
      </div>
    </div>
  );
}
