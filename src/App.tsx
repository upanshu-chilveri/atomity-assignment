import { useState } from "react";
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

  return (
    <div className="app-wrapper">
      <DateFilter />

      <ClusterHeader
        selectedCluster={selectedCluster}
        selectedNamespace={selectedNamespace}
      />

      <ClusterTable data={data} onSelectCluster={handleSelect} />

      {(selectedCluster || selectedNamespace) && (
        <button className="back-btn" onClick={goBack}>
          ← Back
        </button>
      )}
    </div>
  );
}

export default App;
