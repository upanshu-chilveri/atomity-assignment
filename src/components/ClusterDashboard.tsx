import { useState } from "react";
import ClusterHeader from "./ClusterHeader";
import ClusterTable from "./ClusterTable";
import { clusterData, namespaceData } from "../data";

export default function ClusterDashboard() {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  const data = selectedCluster ? (namespaceData[selectedCluster] ?? []) : clusterData;

  return (
    <div>
      <ClusterHeader selectedCluster={selectedCluster} selectedNamespace={null} />

      <ClusterTable
        data={data}
        onSelectCluster={(cluster) => setSelectedCluster(cluster)}
      />

      {selectedCluster && (
        <button onClick={() => setSelectedCluster(null)}>Back</button>
      )}
    </div>
  );
}
