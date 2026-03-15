import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TimeRange } from "../types/clusterData";
import { TIME_RANGES } from "../types/clusterData";

interface DateFilterProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

function DateFilter({ selectedRange, onRangeChange }: DateFilterProps) {
  const [open, setOpen] = useState(false);

  const options = TIME_RANGES;

  const handleSelect = (option: TimeRange) => {
    onRangeChange(option);
    setOpen(false);
  };

  return (
    <div className="dropdown" role="combobox" aria-expanded={open} aria-haspopup="listbox">
      <motion.button
        className="dropdown-btn"
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={`Time range: ${selectedRange}. Click to change`}
        aria-expanded={open}
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
            role="listbox"
            aria-label="Time range options"
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
                role="option"
                aria-selected={option === selectedRange}
                className="dropdown-item"
                onClick={() => handleSelect(option)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect(option); }}
                tabIndex={0}
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