import React, { ReactNode } from 'react'
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

const layout = async ({children}: {children: ReactNode}) => {
    const clerkUser = await currentUser();
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser?.id },
    });
    if (!user) return redirect("/sync");
    if (user.role !== "ADMIN") return redirect("/dashboard");
  return (
    <div>
        {children}
    </div>
  )
}

export default layout