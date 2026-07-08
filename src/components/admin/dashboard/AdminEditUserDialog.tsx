import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/shared/types";
import { EditUserFormFields } from "./EditUserFormFields";

interface AdminEditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUserForEdit: User | null;
  setSelectedUserForEdit: (user: User | null) => void;
  handleUpdateUserByAdmin: (e: React.FormEvent) => void;
}

export function AdminEditUserDialog({
  open, onOpenChange, selectedUserForEdit, setSelectedUserForEdit, handleUpdateUserByAdmin,
}: AdminEditUserDialogProps) {
  if (!selectedUserForEdit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-[32px] bg-card border-border overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-primary">Edit User Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdateUserByAdmin} className="space-y-6 pt-4">
          <EditUserFormFields user={selectedUserForEdit} onChange={setSelectedUserForEdit} />
          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold">Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 rounded-xl px-8 font-bold shadow-lg shadow-primary/20">Update Profile</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
