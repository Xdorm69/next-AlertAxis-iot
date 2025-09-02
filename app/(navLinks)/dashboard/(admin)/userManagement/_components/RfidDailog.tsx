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
import { RFID } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HoverCardForText } from "../../../_components/HoverCardForText";
import { SkeletonRow } from "../../../_components/SkeletonRow";

export const RfidDialog = ({
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
      <DialogContent
        autoFocus={false}
        className="sm:max-w-2xl max-h-[80vh] flex flex-col"
      >
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
