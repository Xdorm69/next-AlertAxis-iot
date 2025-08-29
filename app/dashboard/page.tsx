import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const DashboardPage = async () => {
  const user = await currentUser();

  return (
    <section className="min-h-screen mt-18">
      <div className="container mx-auto py-4 px-4 xl:w-7xl h-full">
        <h1 className="text-4xl font-bold">Hello {user?.firstName} 👋</h1>
        <p className="text-muted-foreground font-mono mt-2">
          A dashboard presents a summary of system metrics and status.
        </p>
      </div>
    </section>
  );
};

export default DashboardPage;
