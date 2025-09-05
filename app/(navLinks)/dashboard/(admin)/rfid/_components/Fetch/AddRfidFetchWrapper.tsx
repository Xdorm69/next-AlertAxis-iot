"use client";

import { AddRfidDialog } from "../AddRfidDialog";

const mockUsers = [
  { id: "u1", name: "Alice" },
  { id: "u2", name: "Bob" },
  { id: "u3", name: "Charlie" },
];

export default function AddRfidFetchWrapper() {
  async function handleAddRfid(data: any) {
    console.log("Form Data Submitted: ", data);
    // await fetch("/api/rfid", { method: "POST", body: JSON.stringify(data) });
  }

  return (
    <div>
      <AddRfidDialog users={mockUsers} onSubmit={handleAddRfid} />
    </div>
  );
}
