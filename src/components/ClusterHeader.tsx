import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

interface Props {
  selectedCluster: string | null;
  selectedNamespace: string | null;
}

const segmentVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 350, damping: 25 }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

function ClusterHeader({
  selectedCluster,
  selectedNamespace,
}: Props) {
  return (
    <header
      className="cluster-header flex flex-wrap items-center gap-y-2 min-h-[48px]"
      aria-label="Navigation breadcrumb"
    >
      <div className="flex items-center flex-wrap gap-y-2">
        <AnimatePresence mode="popLayout">
          <motion.div
            key="cluster-segment"
            layout
            variants={segmentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="cluster-pill"
          >
            {selectedCluster || "Clusters"}
          </motion.div>

          {selectedCluster && (
            <motion.div
              key="namespace-segment"
              layout
              variants={segmentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center gap-2"
            >
              <span className="text-gray-400 font-bold mx-1" aria-hidden>/ </span>
              <div className="cluster-pill">
                {selectedNamespace || "Namespaces"}
              </div>
            </motion.div>
          )}

          {selectedNamespace && (
            <motion.div
              key="pod-segment"
              layout
              variants={segmentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center gap-2"
            >
              <span className="text-gray-400 font-bold mx-1" aria-hidden>/ </span>
              <div className="cluster-pill">
                Pods
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        key="aggregate-segment"
        layout
        variants={segmentVariants}
        initial="hidden"
        animate="visible"
        className="aggregate-box ml-auto"
        aria-live="polite"
        aria-label={`Aggregated by ${selectedNamespace ? 'Pod' : selectedCluster ? 'Namespace' : 'Cluster'
          }`}
      >
        <span>Aggregated by:</span>
        <motion.strong
          key={selectedNamespace ? "Pod" : selectedCluster ? "Namespace" : "Cluster"}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {selectedNamespace ? "Pod" : selectedCluster ? "Namespace" : "Cluster"}
        </motion.strong>
      </motion.div>
    </header>
  );
}

export default ClusterHeader;