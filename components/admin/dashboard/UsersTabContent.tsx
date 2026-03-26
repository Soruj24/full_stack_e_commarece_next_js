
import { UserTable } from "@/components/admin/dashboard/UserTable";
import { User } from "@/types";

interface UsersTabContentProps {
  filteredUsers: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onChangeRole: (userId: string, newRole: string) => void;
  onUpdateStatus: (userId: string, newStatus: string) => void;
  onDelete: (userId: string) => void;
  onClearSearch: () => void;
}

export function UsersTabContent({
  filteredUsers,
  loading,
  onEdit,
  onChangeRole,
  onUpdateStatus,
  onDelete,
  onClearSearch,
}: UsersTabContentProps) {
  return (
    <UserTable
      users={filteredUsers}
      loading={loading}
      onEdit={onEdit}
      onChangeRole={onChangeRole}
      onUpdateStatus={onUpdateStatus}
      onDelete={onDelete}
      onClearSearch={onClearSearch}
    />
  );
}
