import React, { useRef, useState } from "react";
import { Search } from "lucide-react";

const SearchDashboard = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (search: string) => void;
}) => {
    //making a local state for ui
    const [localSearch, setLocalSearch] = useState(search);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const value = e.target.value;
    setLocalSearch(value);
    timeoutRef.current = setTimeout(() => {
      setSearch(value);
    }, 500);
  };

  return (
    <div className="w-full lg:w-fit px-2 rounded-lg shadow bg-card flex gap-2 items-center border border-border">
      <Search className="h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        value={localSearch} // ✅ controlled instead of defaultValue
        onChange={handleValueChange}
        placeholder="Search..."
        autoFocus={false} // ✅ prevent auto-focus on mount
        className="h-8 w-full lg:w-48 border-0 text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
    </div>
  );
};

export default SearchDashboard;
