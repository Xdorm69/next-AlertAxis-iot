"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { defaultQueryOptions } from "@/lib/helpers/queryOptions";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkeletonRow } from "../../../_components/SkeletonRow";
import { Device } from "@prisma/client";
import { HoverCardForText } from "../../../_components/HoverCardForText";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormatDate } from "../../../_components/Rfid/RfidDataTable";

const devicesTableCell = [
  "Id",
  "Serial Number",
  "Name",
  "Location",
  "Status",
  "Registered By",
  "Installed At",
  "Toggle",
  "Delete",
];

const DevicesTable = () => {
  const {
    data: res,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["devices-data-all"],
    queryFn: async () => {
      const res = await fetch("/api/devices");
      const data = await res.json();
      if (!res.ok) {
        toast.error("Error fetching devices data", { id: "devices-data" });
        throw data;
      }
      return data;
    },
    ...defaultQueryOptions,
  });

  const data = res?.data;
  return (
    <div className="mt-4">
      <Table className="border">
        <TableHeader>
          <TableRow>
            {devicesTableCell.map((cell, idx) => (
              <TableCell key={idx} className="font-semibold bg-card">
                {cell}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {(isLoading || isFetching) &&
            Array.from({ length: 5 }).map((_, idx) => {
              return <SkeletonRow key={idx} length={devicesTableCell.length} />;
            })}
          {!isFetching && !data && (
            <TableRow>
              <TableCell colSpan={devicesTableCell.length}>
                <div className="h-8 bg-gray-700 rounded animate-pulse w-full" />
              </TableCell>
            </TableRow>
          )}
          {!isFetching &&
            data &&
            data.map((device: Device) => (
              <TableRow key={device.id}>
                <TableCell>
                  <HoverCardForText data={device.id} tag="Id" />
                </TableCell>
                <TableCell>{device.serialNumber}</TableCell>
                <TableCell>{device.name}</TableCell>
                <TableCell>{device.location}</TableCell>
                <TableCell>
                  <Badge
                    className="text-white"
                    variant={
                      device.status === "ACTIVE" ? "default" : "destructive"
                    }
                  >
                    {device.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <HoverCardForText
                    data={device.registeredById}
                    tag="User Id"
                  />
                </TableCell>
                <TableCell>
                  <HoverCardForText
                    data={[{ date: new Date(device.installedAt).toLocaleString() }]}
                    tag="Created At"
                    displayKey={FormatDate(new Date(device.installedAt))}
                  />
                </TableCell>
                <TableCell>
                  <ToggleDeviceStatusButton
                    deviceId={device.id}
                    status={device.status as "ACTIVE" | "INACTIVE"}
                  />
                </TableCell>
                <TableCell>
                  <DeleteDeviceAlertDialog deviceId={device.id} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <div>
        <AddDeviceDialog />
      </div>
    </div>
  );
};

export default DevicesTable;

type DeleteDeviceAlertDialogProps = {
  deviceId: string;
};

export const DeleteDeviceAlertDialog: React.FC<
  DeleteDeviceAlertDialogProps
> = ({ deviceId }) => {
  const queryClient = useQueryClient();
  const deleteDeviceMutation = useMutation({
    mutationKey: ["delete-device"],
    mutationFn: async () => {
      const res = await fetch(`/api/devices/${deviceId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw data;
      return data;
    },
    onMutate: () => {
      toast.loading("Deleting device...", { id: "delete-device" });
    },
    onSuccess: () => {
      toast.success("Device deleted successfully", { id: "delete-device" });
      queryClient.invalidateQueries({ queryKey: ["devices-data-all"] });
    },
    onError: (data: { error: string }) => {
      toast.error(data.error || "Error deleting device", {
        id: "delete-device",
      });
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Device</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this device? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteDeviceMutation.mutate();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const ToggleDeviceStatusButton = ({
  deviceId,
  status,
}: {
  deviceId: string;
  status: DeviceStatus;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["device-status", deviceId],
    mutationFn: async (newStatus: DeviceStatus) => {
      const res = await fetch(`/api/devices/${deviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      return data;
    },
    onMutate: () => {
      toast.loading("Updating device status...", {
        id: `device-status-${deviceId}`,
      });
    },
    onError: (data: { error: string }) => {
      toast.error(data.error || "Error updating device status", {
        id: `device-status-${deviceId}`,
      });
    },
    onSuccess: (data: { message: string }) => {
      queryClient.invalidateQueries({ queryKey: ["devices-data-all"] });
      toast.success(data.message || "Device status updated", {
        id: `device-status-${deviceId}`,
      });
    },
  });

  const handleChange = (value: DeviceStatus) => {
    mutation.mutate(value);
  };

  {
    mutation.isPending && (
      <div className="w-32 h-10 bg-gray-700 rounded animate-pulse" />
    );
    return (
      <Select
        value={status}
        onValueChange={(val) => handleChange(val as DeviceStatus)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="INACTIVE">Inactive</SelectItem>
          <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
        </SelectContent>
      </Select>
    );
  }
};

type DeviceStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";

export const AddDeviceDialog = () => {
  const [serialNumber, setSerialNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [status, setStatus] = useState<DeviceStatus>("ACTIVE");

  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const addDeviceMutation = useMutation({
    mutationKey: ["add-device"],
    mutationFn: async ({
      name,
      serialNumber,
      location,
      status,
    }: {
      name: string;
      serialNumber: string;
      location: string;
      status: DeviceStatus;
    }) => {
      const res = await fetch("/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serialNumber, name, location, status }),
      });

      const data = await res.json();
      if (!res.ok) throw data;
      return data;
    },
    onMutate: () => {
      toast.loading("Adding device...", { id: "add-device" });
    },
    onSuccess: (data: { message: string }) => {
      toast.success(data.message || "Device added", {
        id: "add-device",
      });
      queryClient.invalidateQueries({ queryKey: ["devices-data-all"] });
    },
    onError: (data: { error: string }) => {
      toast.error(data.error || "Error adding device", {
        id: "add-device",
      });
    },
  });

  const handleSubmit = () => {
    if (!serialNumber || !name || !location) return;
    addDeviceMutation.mutate({ name, serialNumber, location, status });
    setOpen(false);
    // Reset form
    setSerialNumber("");
    setName("");
    setLocation("");
    setStatus("ACTIVE");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-white border border-emerald-300 bg-emerald-600 hover:bg-emerald-700 mt-4">
          Add Device
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
          <DialogDescription>Enter device details below.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input
              id="serialNumber"
              value={serialNumber}
              placeholder="Enter serial number"
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              placeholder="Enter name of device"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              placeholder="Enter location of device"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as DeviceStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Add Device</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
