import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ClusterTable from "./components/ClusterTable";
import DateFilter from "./components/DateDropdown";
import ClusterHeader from "./components/ClusterHeader";
import { clusterData, namespaceData, podData } from "./data";
import type { ClusterData } from "./types/clusterData";

function App() {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [selectedNamespace, setSelectedNamespace] = useState<string | null>(
    null
  );
  const [theme, setTheme] = useState<"light" | "dark">("light");

  let data: ClusterData[] = [];

  if (!selectedCluster) {
    data = clusterData;
  } else if (selectedCluster && !selectedNamespace) {
    data = namespaceData[selectedCluster] ?? [];
  } else {
    data = podData[selectedCluster!]?.[selectedNamespace!] ?? [];
  }

  const handleSelect = (name: string) => {
    if (!selectedCluster) {
      setSelectedCluster(name);
    } else if (!selectedNamespace) {
      setSelectedNamespace(name);
    }
  };

  const goBack = () => {
    if (selectedNamespace) {
      setSelectedNamespace(null);
    } else if (selectedCluster) {
      setSelectedCluster(null);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  return (
    <motion.div 
      className={`app-wrapper ${theme === "dark" ? "dark" : ""}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 w-full">
        <DateFilter />
        
        <motion.button 
          onClick={toggleTheme}
          className="dropdown-btn mb-4 sm:mb-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          style={{ width: "40px", height: "40px", padding: 0, display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </motion.button>
      </div>

      <ClusterHeader
        selectedCluster={selectedCluster}
        selectedNamespace={selectedNamespace}
      />

      <div className="table-container">
        <ClusterTable data={data} onSelectCluster={handleSelect} />
      </div>

      <AnimatePresence>
        {(selectedCluster || selectedNamespace) && (
          <motion.button 
            className="back-btn" 
            onClick={goBack}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            ← Back
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default App;
