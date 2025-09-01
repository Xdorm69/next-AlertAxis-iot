"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LottieAnimPlayer from "@/components/LottieAnimPlayer";
import lottieAnim from "@/public/dashboard/admin/userManagement.json";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { SkeletonRow } from "../SkeletonRow";
import { UsersDataSchema } from "@/app/api/users/route";
import { HoverCardForText } from "../HoverCardForText";
import { RFID } from "@prisma/client";

const UserManagementData = {
  title: "User Management 👥",
  desc: "Add, edit, and manage users & roles.",
  lottieAnim: lottieAnim,
};

const UserManagement = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Card className="h-[300px] overflow-hidden relative hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-primary font-semibold">
                {UserManagementData.title}
              </CardTitle>
              <CardDescription className="font-mono">
                {UserManagementData.desc}
              </CardDescription>
            </CardHeader>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-full scale-110">
              <LottieAnimPlayer
                lottieAnimation={UserManagementData.lottieAnim}
              />
            </div>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{UserManagementData.title}</DialogTitle>
            <DialogDescription>{UserManagementData.desc}</DialogDescription>
          </DialogHeader>

          {/* Custom content goes here */}
          <div className="py-4">
            <UserDataTable />
          </div>

          <DialogFooter className="flex justify-between">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button variant="default" className="text-white">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const UserDataTable = () => {
  const {
    data: res,
    isLoading,
    isFetching,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["users-data"],
    queryFn: () => fetch("/api/users").then((res) => res.json()),
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  });

  const data: UsersDataSchema[] | null = res?.users;

  return (
    <Table className="border rounded-lg">
      <TableHeader>
        <TableRow className="bg-muted/50 text-sm font-semibold">
          <TableCell>Id</TableCell>
          <TableCell>Username</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>RFID</TableCell>
          <TableCell>Devices</TableCell>
          <TableCell>Created At</TableCell>
          <TableCell>Updated At</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(isLoading || isFetching) && (
          <>
            <SkeletonRow length={8} />
          </>
        )}
        {isError && (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-4 text-red-500">
              Error fetching users
            </TableCell>
          </TableRow>
        )}
        {isSuccess && !isFetching && !data?.length ? (
          <TableRow>
            <TableCell colSpan={8} className="h-24 text-center">
              No users found.
            </TableCell>
          </TableRow>
        ) : (
          !isLoading &&
          !isFetching &&
          data?.map((user, i) => (
            <TableRow
              key={user.id}
              className={i % 2 === 0 ? "bg-muted/20" : ""}
            >
              <TableCell>
                <HoverCardForText data={user.id} tag="id" />
              </TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                <HoverCardForText data={user.email} tag="email" />
              </TableCell>
              <TableCell>
                <RfidDialog
                  length={user.rfids?.length || 0}
                  rfid={user.rfids}
                  isFetching={isFetching}
                />
              </TableCell>
              <TableCell>{user.devices?.length || 0}</TableCell>
              <TableCell>
                {user.createdAt &&
                  new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {user.updatedAt &&
                  new Date(user.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button className="text-white">Edit</Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

const RfidDialog = ({
  length,
  rfid,
  isFetching,
}: {
  length: number;
  rfid: RFID[];
  isFetching: boolean;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-white" variant={"ghost"}>
          {length}
        </Button>
      </DialogTrigger>
      <DialogContent autoFocus={false} className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>RFIDs</DialogTitle>
          <DialogDescription>
            Data of RFIDs linked with this user.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable table wrapper */}
        <div className="py-4 overflow-auto rounded-md max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow className="bg-card sticky top-0 z-10">
 
                <TableCell className="font-semibold">Tag Id</TableCell>
                <TableCell className="font-semibold">Created At</TableCell>
                <TableCell className="font-semibold">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching && <SkeletonRow length={4} />}
              {!isFetching && !rfid.length && (
                <TableRow>
                  <TableCell colSpan={3} className="py-4 text-center">
                    No RFIDs found.
                  </TableCell>
                </TableRow>
              )}
              {!isFetching &&
                rfid.map((rfid) => (
                  <TableRow key={rfid.id}>
                    <TableCell>
                      <HoverCardForText data={rfid.tagId} tag="tagId" />
                    </TableCell>
                    <TableCell>
                      {new Date(rfid.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        className="text-white"
                        size="sm"
                        variant="default"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button variant="default">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagement;
