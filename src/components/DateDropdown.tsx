import { useState } from "react";

type FilterOption = "Today" | "Last Week" | "Last 30 Days";

function DateFilter() {
  const [selected, setSelected] = useState<FilterOption>("Last 30 Days");
  const [open, setOpen] = useState(false);

  const options: FilterOption[] = ["Today", "Last Week", "Last 30 Days"];

  const handleSelect = (option: FilterOption) => {
    setSelected(option);
    setOpen(false);
  };

  return (
    <div className="dropdown">
      <button className="dropdown-btn" onClick={() => setOpen(!open)}>
        {selected}
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <div
              key={option}
              className="dropdown-item"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DateFilter;
