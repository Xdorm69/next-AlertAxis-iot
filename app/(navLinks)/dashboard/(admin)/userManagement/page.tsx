import React from "react";
import { UserDataTable } from "./_components/UserDataTable";
import RotatingStar from "./_components/RotatingStar";

const page = () => {
  return (
    <section>
      <div className="container mx-auto py-4 px-4 xl:w-7xl h-full">
        <div className="my-20">
          <h1 className="text-2xl md:text-2xl lg:text-4xl font-bold text-primary">
            User Management 👥
          </h1>
          <div className="text-muted-foreground font-mono mt-2 text-sm w-full lg:w-3/4 md:text-md flex flex-col">
            <p>Add, edit, and manage users & roles.</p>
            <div className="flex flex-wrap gap-1 mt-2">
              <div className="flex items-center gap-1 h-fit">
                <RotatingStar />
                <span className="text-white">Tip: </span>
              </div>
              Click on rfid or device to open a user's info.
            </div>
          </div>
          <div className="mt-12">
            <UserDataTable />
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
