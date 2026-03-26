import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/types";

interface AdminEditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUserForEdit: User | null;
  setSelectedUserForEdit: (user: User | null) => void;
  handleUpdateUserByAdmin: (e: React.FormEvent) => void;
}

export function AdminEditUserDialog({
  open,
  onOpenChange,
  selectedUserForEdit,
  setSelectedUserForEdit,
  handleUpdateUserByAdmin,
}: AdminEditUserDialogProps) {
  if (!selectedUserForEdit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-[32px] bg-card border-border overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-primary">
            Edit User Profile
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdateUserByAdmin} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-muted-foreground ml-1">
                Full Name
              </Label>
              <Input
                value={selectedUserForEdit.name}
                onChange={(e) =>
                  setSelectedUserForEdit({
                    ...selectedUserForEdit,
                    name: e.target.value,
                  })
                }
                className="h-12 rounded-xl bg-muted/50 border-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-muted-foreground ml-1">
                Email (Cannot be changed)
              </Label>
              <Input
                disabled
                value={selectedUserForEdit.email}
                className="h-12 rounded-xl bg-muted/50 border-none text-muted-foreground/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-muted-foreground ml-1">
                Designation
              </Label>
              <Input
                value={selectedUserForEdit.designation || ""}
                onChange={(e) =>
                  setSelectedUserForEdit({
                    ...selectedUserForEdit,
                    designation: e.target.value,
                  })
                }
                className="h-12 rounded-xl bg-muted/50 border-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-muted-foreground ml-1">
                Phone Number
              </Label>
              <Input
                value={selectedUserForEdit.phoneNumber || ""}
                onChange={(e) =>
                  setSelectedUserForEdit({
                    ...selectedUserForEdit,
                    phoneNumber: e.target.value,
                  })
                }
                className="h-12 rounded-xl bg-muted/50 border-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-muted-foreground ml-1">
                Location
              </Label>
              <Input
                value={selectedUserForEdit.location || ""}
                onChange={(e) =>
                  setSelectedUserForEdit({
                    ...selectedUserForEdit,
                    location: e.target.value,
                  })
                }
                className="h-12 rounded-xl bg-muted/50 border-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-muted-foreground ml-1">
                Website
              </Label>
              <Input
                value={selectedUserForEdit.website || ""}
                onChange={(e) =>
                  setSelectedUserForEdit({
                    ...selectedUserForEdit,
                    website: e.target.value,
                  })
                }
                className="h-12 rounded-xl bg-muted/50 border-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-muted-foreground ml-1">
              Bio
            </Label>
            <Textarea
              value={selectedUserForEdit.bio || ""}
              onChange={(e) =>
                setSelectedUserForEdit({
                  ...selectedUserForEdit,
                  bio: e.target.value,
                })
              }
              className="rounded-xl bg-muted/50 border-none min-h-[100px]"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-muted-foreground ml-1 uppercase tracking-widest">
              Social Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground ml-1">
                  Twitter
                </Label>
                <Input
                  value={selectedUserForEdit.socialLinks?.twitter || ""}
                  onChange={(e) =>
                    setSelectedUserForEdit({
                      ...selectedUserForEdit,
                      socialLinks: {
                        ...selectedUserForEdit.socialLinks,
                        twitter: e.target.value,
                      },
                    })
                  }
                  className="h-10 rounded-xl bg-muted/50 border-none"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground ml-1">
                  LinkedIn
                </Label>
                <Input
                  value={selectedUserForEdit.socialLinks?.linkedin || ""}
                  onChange={(e) =>
                    setSelectedUserForEdit({
                      ...selectedUserForEdit,
                      socialLinks: {
                        ...selectedUserForEdit.socialLinks,
                        linkedin: e.target.value,
                      },
                    })
                  }
                  className="h-10 rounded-xl bg-muted/50 border-none"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground ml-1">
                  GitHub
                </Label>
                <Input
                  value={selectedUserForEdit.socialLinks?.github || ""}
                  onChange={(e) =>
                    setSelectedUserForEdit({
                      ...selectedUserForEdit,
                      socialLinks: {
                        ...selectedUserForEdit.socialLinks,
                        github: e.target.value,
                      },
                    })
                  }
                  className="h-10 rounded-xl bg-muted/50 border-none"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground ml-1">
                  Facebook
                </Label>
                <Input
                  value={selectedUserForEdit.socialLinks?.facebook || ""}
                  onChange={(e) =>
                    setSelectedUserForEdit({
                      ...selectedUserForEdit,
                      socialLinks: {
                        ...selectedUserForEdit.socialLinks,
                        facebook: e.target.value,
                      },
                    })
                  }
                  className="h-10 rounded-xl bg-muted/50 border-none"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-xl font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
            >
              Update Profile
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
