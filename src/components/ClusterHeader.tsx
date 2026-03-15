interface Props {
  selectedCluster: string | null;
  selectedNamespace: string | null;
}

export default function ClusterHeader({ selectedCluster, selectedNamespace }: Props) {
  return (
    <div className="cluster-header">
      {!selectedCluster && <div className="cluster-pill">Cluster</div>}

      {selectedCluster && !selectedNamespace && (
        <div className="cluster-selected">
          <div className="cluster-pill">{selectedCluster} - Namespace</div>

          <div className="aggregate-box">
            <span>Aggregated by:</span>
            <strong>Namespace</strong>
          </div>
        </div>
      )}

      {selectedCluster && selectedNamespace && (
        <div className="cluster-selected">
          <div className="cluster-pill">
            {selectedCluster} - {selectedNamespace} - Pod
          </div>

          <div className="aggregate-box">
            <span>Aggregated by:</span>
            <strong>Pod</strong>
          </div>
        </div>
      )}
    </div>
  );
}
