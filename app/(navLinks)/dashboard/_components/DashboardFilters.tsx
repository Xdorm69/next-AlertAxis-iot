"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SearchDashboard from "./SearchDashboard";
import SelectStatusDashboard from "./SelectStatusDashboard";
import SelectRoleDashboard from "./SelectRoleDashboard";
import { DateRangePicker } from "./DateRangePicker";
import { Filter } from "lucide-react";

export default function DashboardFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  date,
  setDate,
  user,
  data,
  DownloadCSV,
}: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      {/* Desktop filters (lg and up) */}
      <div className="hidden lg:flex gap-4">
        <SearchDashboard search={search} setSearch={setSearch} />
        <SelectStatusDashboard
          setStatusFilter={setStatusFilter}
          statusFilter={statusFilter}
        />
        {user.role === "ADMIN" && (
          <SelectRoleDashboard
            setRoleFilter={setRoleFilter}
            roleFilter={roleFilter}
          />
        )}
        <DateRangePicker date={date} setDate={setDate} />
      </div>

      {/* Mobile + tablet filters (below lg) */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center font-semibold gap-2">
              Filters 
              <Filter className="text-muted-foreground"/>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="space-y-4 px-4 md:px-8 pb-10">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                All the selected filters will be applied to dashboard.
              </SheetDescription>
            </SheetHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-4 px-4">
              <div>
                <h1 className="font-mono text-lg mb-2">Global Search</h1>
                <SearchDashboard search={search} setSearch={setSearch} />
              </div>
              <div>
                <h1 className="font-mono text-lg mb-2">Status</h1>
                <SelectStatusDashboard
                  setStatusFilter={setStatusFilter}
                  statusFilter={statusFilter}
                />
              </div>
              <div>
                <h1 className="font-mono text-lg mb-2">Role</h1>
                {user.role === "ADMIN" && (
                  <SelectRoleDashboard
                    setRoleFilter={setRoleFilter}
                    roleFilter={roleFilter}
                  />
                )}
              </div>
              <div>
                <h1 className="font-mono text-lg mb-2">Date Range</h1>
                <DateRangePicker date={date} setDate={setDate} />
              </div>
            </div>
            <Button
              className="mx-4 text-white font-semibold"
              onClick={() => setOpen(false)}
            >
              Apply
            </Button>
          </SheetContent>
        </Sheet>
      </div>

      {/* CSV button */}
      <Button
        className="text-white font-semibold"
        onClick={() => DownloadCSV(data || [])}
      >
        Download CSV
      </Button>
    </div>
  );
}
