import { motion, AnimatePresence } from "framer-motion";
import type { Cluster, Namespace, Pod } from "../types/clusterData";

type TableDataRow = Cluster | Namespace | Pod;

interface Props {
  data: TableDataRow[];
  onSelectCluster?: (id: string) => void;
}

function ClusterTable({ data, onSelectCluster }: Props) {
  return (
    <table
      className="cluster-table"
      aria-label="Infrastructure cost data"
    >
      <thead>
        <tr>
          <th></th>
          <th>CPU</th>
          <th>RAM</th>
          <th>Storage</th>
          <th>Network</th>
          <th>GPU</th>
          <th>Efficiency</th>
          <th>Total</th>
        </tr>
      </thead>

      <tbody>
        <AnimatePresence>
          {data.map((row) => (
            <motion.tr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              key={row.id}
              onClick={() => onSelectCluster?.(row.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectCluster?.(row.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View details for ${row.name}, total cost $${row.total}`}
              className="clickable-row"
            >
              <td className="cluster-name">{row.name}</td>

              <td>${row.cpu}</td>
              <td>${row.ram}</td>
              <td>${row.storage}</td>
              <td>${row.network}</td>
              <td>${row.gpu}</td>

              <td>{row.efficiency}%</td>

              <td className="total">${row.total}</td>
            </motion.tr>
          ))}
        </AnimatePresence>
      </tbody>
    </table>
  );
}

export default ClusterTable;
