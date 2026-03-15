import { motion } from "framer-motion";

interface Props {
  selectedCluster: string | null;
  selectedNamespace: string | null;
}

export default function ClusterHeader({
  selectedCluster,
  selectedNamespace,
}: Props) {
  return (
    <div className="cluster-header">
      {!selectedCluster && (
        <motion.div
          layoutId="header-pill"
          className="cluster-pill"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          Cluster
        </motion.div>
      )}

      {selectedCluster && !selectedNamespace && (
        <motion.div
          className="cluster-selected"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div layoutId="header-pill" className="cluster-pill">
            {selectedCluster} - Namespace
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="aggregate-box"
          >
            <span>Aggregated by:</span>
            <strong>Namespace</strong>
          </motion.div>
        </motion.div>
      )}

      {selectedCluster && selectedNamespace && (
        <motion.div
          className="cluster-selected"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div layoutId="header-pill" className="cluster-pill">
            {selectedCluster} - {selectedNamespace} - Pod
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="aggregate-box"
          >
            <span>Aggregated by:</span>
            <strong>Pod</strong>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
