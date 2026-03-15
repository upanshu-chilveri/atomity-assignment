import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TimeRange } from "../types/clusterData";

interface DateFilterProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

function DateFilter({ selectedRange, onRangeChange }: DateFilterProps) {
  const [open, setOpen] = useState(false);

  const options: TimeRange[] = ["Today", "Last Week", "Last 30 Days"];

  const handleSelect = (option: TimeRange) => {
    onRangeChange(option);
    setOpen(false);
  };

  return (
    <div className="dropdown">
      <motion.button 
        className="dropdown-btn" 
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {selectedRange}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div 
            className="dropdown-menu"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 24,
              opacity: { duration: 0.15 }
            }}
            style={{ transformOrigin: "top left" }}
          >
            {options.map((option) => (
              <div
                key={option}
                className="dropdown-item"
                onClick={() => handleSelect(option)}
              >
                {option}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DateFilter;
