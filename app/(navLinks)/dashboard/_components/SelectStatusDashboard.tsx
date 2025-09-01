import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Hand, CircleCheckBig, OctagonX } from 'lucide-react';

const SelectStatusDashboard = ({ setStatusFilter, statusFilter }: { setStatusFilter: (status: string) => void, statusFilter: string }) => {
  return (
    <div>
      <Select onValueChange={setStatusFilter} value={statusFilter}>
        <SelectTrigger className="w-20 md:w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">
            <Hand />
            All
          </SelectItem>
          <SelectItem value="GRANTED">
            <CircleCheckBig />
            Granted
          </SelectItem>
          <SelectItem value="DENIED">
            <OctagonX />
            Denied
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectStatusDashboard
