import { Button } from "@/components/ui/button";
import RfidDataTableFetchWrapper from "../../_components/Rfid/fetch/RfidDataTableFetchWrapper";
import AddRfidFetchWrapper from "./_components/Fetch/AddRfidFetchWrapper";

const page = () => {
  return (
    <section>
      <div className="container mx-auto px-4 xl:w-7xl h-full">
        <div className="my-20">
          <div className="flex justify-between w-full">
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold text-primary">
                RFID&apos;S
              </h1>
              <p className="text-muted-foreground font-mono mt-2 text-sm w-full lg:w-3/4 md:text-md">
                Manage RFID&apos;s.
              </p>
            </div>
            <AddRfidFetchWrapper />
          </div>
          <div className="mt-8">
            <RfidDataTableFetchWrapper />
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
