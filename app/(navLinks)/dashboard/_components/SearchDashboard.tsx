import React, { useRef } from "react";
import { Search } from "lucide-react";

const SearchDashboard = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (search: string) => void;
}) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const value = e.target.value;
    timeoutRef.current = setTimeout(() => {
      setSearch(value);
    }, 500);
  };

  return (
    <div className="w-full lg:w-fit px-2 rounded-lg shadow bg-card flex gap-2 items-center border border-border">
      <Search className="h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        defaultValue={search}
        onChange={handleValueChange}
        placeholder="Search..."
        className="h-8 border-0 text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
    </div>
  );
};

export default SearchDashboard;
