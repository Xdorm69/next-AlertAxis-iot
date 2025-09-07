"use client";

import * as React from "react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestTypes } from "@prisma/client";

export default function RequestByUserDialog() {
  const [open, setOpen] = useState(false);
  const [requestType, setRequestType] = useState<RequestTypes | "">("");
  const [tagId, setTagId] = useState("");
  const [rfidId, setRfidId] = useState("");
  const [targetRfidId, setTargetRfidId] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["add-request-by-user"],
    mutationFn: async () => {
      const payload: any = { requestType };

      switch (requestType) {
        case RequestTypes.CREATE:
        case RequestTypes.ACTIVATE:
          payload.tagId = tagId;
          break;

        case RequestTypes.DEACTIVATE:
          payload.rfidId = rfidId;
          break;

        case RequestTypes.PORT:
          payload.rfidId = rfidId;
          payload.targetRfidId = targetRfidId;
          break;
      }

      const res = await fetch("/api/rfid/add-rfid-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      return res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["pending-requests"] });
        alert("Request submitted successfully!");
        resetForm();
        setOpen(false);
      } else {
        alert(data.error || "Failed to submit request");
      }
    },
    onError: (error) => {
      console.error(error);
      alert("Internal server error");
    },
  });

  const resetForm = () => {
    setTagId("");
    setRfidId("");
    setTargetRfidId("");
    setRequestType("");
  };

  const handleSubmit = () => {
    if (!requestType) return alert("Please select a request type");

    switch (requestType) {
      case RequestTypes.CREATE:
      case RequestTypes.ACTIVATE:
        if (!tagId) return alert("Tag ID is required");
        break;

      case RequestTypes.DEACTIVATE:
        if (!rfidId) return alert("RFID ID is required");
        break;

      case RequestTypes.PORT:
        if (!rfidId || !targetRfidId) {
          return alert("Both RFID ID and Target RFID ID are required");
        }
        break;
    }

    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add RFID Request</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit RFID Request</DialogTitle>
          <DialogDescription>
            Choose the request type and provide the required RFID information.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          {/* Request Type Select */}
          <Select
            value={requestType}
            onValueChange={(value) => setRequestType(value as RequestTypes)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select request type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={RequestTypes.CREATE}>CREATE</SelectItem>
              <SelectItem value={RequestTypes.ACTIVATE}>ACTIVATE</SelectItem>
              <SelectItem value={RequestTypes.DEACTIVATE}>
                DEACTIVATE
              </SelectItem>
              <SelectItem value={RequestTypes.PORT}>PORT</SelectItem>
            </SelectContent>
          </Select>

          {/* TagId input for CREATE / ACTIVATE */}
          {(requestType === RequestTypes.CREATE ||
            requestType === RequestTypes.ACTIVATE) && (
            <Input
              placeholder="Tag ID"
              value={tagId}
              onChange={(e) => setTagId(e.target.value)}
            />
          )}

          {/* RfidId input for DEACTIVATE / PORT */}
          {(requestType === RequestTypes.DEACTIVATE ||
            requestType === RequestTypes.PORT) && (
            <Input
              placeholder="RFID ID"
              value={rfidId}
              onChange={(e) => setRfidId(e.target.value)}
            />
          )}

          {/* TargetRfidId input for PORT */}
          {requestType === RequestTypes.PORT && (
            <Input
              placeholder="Target RFID ID"
              value={targetRfidId}
              onChange={(e) => setTargetRfidId(e.target.value)}
            />
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit} disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
