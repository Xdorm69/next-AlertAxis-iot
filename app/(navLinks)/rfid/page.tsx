import { UserInfoTable } from "../dashboard/(admin)/rfid/[userId]/_components/UserInfoTable";
import { RfidInfoTable } from "../dashboard/(admin)/rfid/[userId]/_components/RfidInfoTable";
import { ActivityLogsTable } from "../dashboard/(admin)/rfid/[userId]/_components/ActivityLogsTable";
import { AccessResultsTrendGraph } from "../dashboard/(admin)/rfid/[userId]/_components/AccessResultTrendGraph";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { FetchTable } from "@/components/Table/FetchTable";
import { apiFetch } from "@/lib/api";
import { ApiResponse } from "@/Types/api";
import { User } from "@prisma/client";

const page = async () => {
  const { userId } = await auth();
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId as string },
  });

  if (!dbUser) return <h1>Please log in to view</h1>;
  const isUser = dbUser.role === "USER" ? true : false;
  

  return (
    <section className="my-20">
      <div className="container mx-auto py-4 px-4 xl:w-7xl h-full">
        <div>
          <UserInfoTable userId={dbUser.id}/>
          <FetchTable
            queryKey={["users", dbUser.id]}
            queryFn={() =>
              apiFetch<ApiResponse<User[]>>(`/api/users/${dbUser.id}`, {
                method: "PATCH",
              })
            }
            columns={[
              { header: "Id", render: (row) => row.id },
              { header: "Username", render: (row) => row.username },
              { header: "Role", render: (row) => row.role },
              { header: "Email", render: (row) => row.email },
              { header: "AdminSince", render: (row) => row.adminSince },
              { header: "CreatedAt", render: (row) => row.createdAt },
              { header: "UpdatedAt", render: (row) => row.updatedAt },
            ]}
          />
        </div>

        <div>
          <RfidInfoTable userId={dbUser.id} isUser={isUser} />
        </div>

        <div>
          <ActivityLogsTable userId={dbUser.id} />
        </div>

        <div>
          <AccessResultsTrendGraph userId={dbUser.id} />
        </div>
      </div>
    </section>
  );
};

export default page;
