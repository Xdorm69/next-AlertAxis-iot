"use client";

import { UserInfoTable } from "./_components/UserInfoTable";
import { RfidInfoTable } from "./_components/RfidInfoTable";
import { ActivityLogsTable } from "./_components/ActivityLogsTable";
import { AccessResultsTrendGraph } from "./_components/AccessResultTrendGraph";
import React from "react";


const page = ({ params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = React.use(params);

  return (
    <section className="my-20">
      <div className="container mx-auto py-4 px-4 xl:w-7xl h-full">
        <div>
          <UserInfoTable
            userId={userId}
          />
        </div>

        <div>
          <RfidInfoTable
            userId={userId}
          />
        </div>

        <div>
          <ActivityLogsTable
            userId={userId}
          />
        </div>

        <div>
          <AccessResultsTrendGraph
            userId={userId}
          />
        </div>
      </div>
    </section>
  );
};

export default page;
