
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RfidActionsDialogProps {
  open: boolean;
  onClose: () => void;
  users: { id: string; username: string; email: string }[];
  initialData: {
    tagId: string;
    userId?: string;
    active: boolean;
  };
}

export default function RfidActionsDialog({
  open,
  onClose,
  users,
  initialData,
}: RfidActionsDialogProps) {
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState(initialData?.userId ?? "");
  const [active, setActive] = useState(initialData?.active ?? false);

  const filteredUsers = users
    .filter((u) => u.username.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 5); // limit to 5

  const handleSave = () => {
    console.log({
      tagId: initialData.tagId, // read-only
      userId,
      active,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage RFID</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Show Tag ID */}
          <div>
            <Label>RFID Tag ID</Label>
            <Input value={initialData.tagId} disabled />
          </div>

          {/* Active/Inactive toggle */}
          <div>
            <Label>Status</Label>
            <select
              value={active ? "true" : "false"}
              onChange={(e) => setActive(e.target.value === "true")}
              className="w-full border rounded p-2 bg-background"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* User Search + Select */}
          <div>
            <Label>Assign User</Label>
            <Input
              placeholder="Search username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2"
            />
            <div className="border rounded max-h-40 overflow-y-auto">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className={`p-2 cursor-pointer hover:bg-muted ${
                    userId === u.id ? "bg-primary text-white" : ""
                  }`}
                  onClick={() => setUserId(u.id)}
                >
                  {u.username} ({u.email})
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="p-2 text-muted-foreground text-sm">
                  No users found
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
