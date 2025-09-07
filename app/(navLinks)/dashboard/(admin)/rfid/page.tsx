import { Button } from "@/components/ui/button";
import RfidDataTableFetchWrapper from "../../_components/Rfid/fetch/RfidDataTableFetchWrapper";
import AddRfidFetchWrapper from "./_components/Fetch/AddRfidFetchWrapper";
import DevicesTable from "./_components/DevicesTable";
import Link from "next/link";

const page = () => {
  return (
    <section>
      <div className="container mx-auto px-4 xl:w-7xl h-full">
        <div className="my-20">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold text-primary">
                RFID&apos;S
              </h1>
              <p className="text-muted-foreground font-mono mt-2 text-sm w-full lg:w-3/4 md:text-md">
                Manage RFID&apos;s.
              </p>
            </div>
            <Link href={'/dashboard/rfid/pending'}>
              <Button variant={"outline"}>View Pending</Button>
            </Link>
          </div>

          <div className="mt-8">
            <RfidDataTableFetchWrapper />
          </div>

          <div className="mt-8">
            <div>
              <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold text-primary">
                Devices
              </h1>
              <p className="text-muted-foreground font-mono mt-2 text-sm w-full lg:w-3/4 md:text-md">
                Manage Devices.
              </p>
            </div>
            <div>
              <DevicesTable/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
