import { Search, RefreshCw, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-[32px] border border-border/50 shadow-sm">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Admin <span className="text-primary">Dashboard</span>
        </h1>
        <p className="text-muted-foreground font-medium">
          Manage users, monitor activity, and configure settings.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11 rounded-xl bg-muted/50 border-none w-full sm:w-[250px]"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchUsers}
            disabled={loading}
            className="h-11 w-11 rounded-xl border-border/50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            onClick={() => setIsInviteDialogOpen(true)}
            className="h-11 rounded-xl font-bold px-6 shadow-lg shadow-primary/20"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        </div>
      </div>
    </div>
  );
}
