
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, UsersRound, UserStar } from 'lucide-react';
import React from 'react'


const SelectRoleDashboard = ({setRoleFilter, roleFilter}: {setRoleFilter: (role: string) => void, roleFilter: string}) => {
  return (
    <div>
      <Select onValueChange={setRoleFilter} value={roleFilter}>
        <SelectTrigger className="w-full lg:w-32">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">
            <User />
            All
          </SelectItem>
          <SelectItem value="ADMIN">
            <UserStar />
            Admin
          </SelectItem>
          <SelectItem value="USER">
            <UsersRound />
            User
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectRoleDashboard