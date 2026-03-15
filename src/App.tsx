import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ClusterTable from "./components/ClusterTable";
import DateFilter from "./components/DateDropdown";
import ClusterHeader from "./components/ClusterHeader";
import { fetchInfrastructureData } from "./services/api";
import type { Cluster, TimeRange } from "./types/clusterData";
import "./styles/styles.css";

import darkmode from "./assets/darkmode.png";
import lightmode from "./assets/lightmode.png";


function App() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [selectedNamespaceId, setSelectedNamespaceId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("Last 30 Days");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Fetch API Data on Mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchInfrastructureData();
        setClusters(data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch infrastructure data. Please try again.");
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute Multiplier based on TimeRange
  const costMultiplier = useMemo(() => {
    switch (timeRange) {
      case "Today": return 24; // 1 day
      case "Last Week": return 168; // 7 days
      case "Last 30 Days": return 730; // ~30.4 days
      default: return 1;
    }
  }, [timeRange]);

  // Derive Table Data from Hierarchy
  const tableData = useMemo(() => {
    let rows: any[] = [];

    // Level 1: Clusters
    if (!selectedClusterId) {
      rows = clusters;
    }
    // Level 2: Namespaces
    else if (selectedClusterId && !selectedNamespaceId) {
      const cluster = clusters.find(c => c.id === selectedClusterId);
      rows = cluster ? cluster.namespaces : [];
    }
    // Level 3: Pods
    else if (selectedClusterId && selectedNamespaceId) {
      const cluster = clusters.find(c => c.id === selectedClusterId);
      const ns = cluster?.namespaces.find(n => n.id === selectedNamespaceId);
      rows = ns ? ns.pods : [];
    }

    // Apply Time Multiplier to costs
    return rows.map(row => ({
      ...row,
      cpu: Number((row.cpu * costMultiplier).toFixed(2)),
      ram: Number((row.ram * costMultiplier).toFixed(2)),
      storage: Number((row.storage * costMultiplier).toFixed(2)),
      network: Number((row.network * costMultiplier).toFixed(2)),
      gpu: Number((row.gpu * costMultiplier).toFixed(2)),
      total: Number((row.total * costMultiplier).toFixed(2)),
    }));
  }, [clusters, selectedClusterId, selectedNamespaceId, costMultiplier]);

  // Handle Drilldown
  const handleSelect = (id: string) => {
    // Determine level by prefix
    if (id.startsWith("cluster-")) setSelectedClusterId(id);
    else if (id.startsWith("ns-")) setSelectedNamespaceId(id);
    // Pods do not drill down further
  };

  const goBack = () => {
    if (selectedNamespaceId) setSelectedNamespaceId(null);
    else if (selectedClusterId) setSelectedClusterId(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  if (error) {
    return <div className="p-10 text-red-500 font-bold">{error}</div>;
  }

  return (
    <motion.div
      className={`app-wrapper ${theme === "dark" ? "dark" : ""}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 w-full">
        <DateFilter
          selectedRange={timeRange}
          onRangeChange={(range: TimeRange) => setTimeRange(range)}
        />

        <motion.button
          onClick={toggleTheme}
          className="dropdown-btn mb-4 sm:mb-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          style={{ width: "40px", height: "40px", padding: 0, display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          {theme === "light" ? <img src={darkmode} alt="darkmode" className="theme-icon" /> : <img src={lightmode} alt="lightmode" className="theme-icon" />}
        </motion.button>
      </div>

      <ClusterHeader
        selectedCluster={selectedClusterId ? clusters.find(c => c.id === selectedClusterId)?.name || null : null}
        selectedNamespace={selectedNamespaceId ? clusters.find(c => c.id === selectedClusterId)?.namespaces.find(n => n.id === selectedNamespaceId)?.name || null : null}
      />

      <div className="table-container">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500 font-medium">
            Loading infrastructure data from JSONPlaceholder...
          </div>
        ) : (
          <ClusterTable
            data={tableData}
            onSelectCluster={handleSelect}
          />
        )}
      </div>

      <AnimatePresence>
        {(selectedClusterId || selectedNamespaceId) && (
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
