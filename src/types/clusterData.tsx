export interface Pod {
  id: string;
  name: string;
  cpu: number;
  ram: number;
  storage: number;
  network: number;
  gpu: number;
  efficiency: number;
  total: number;
}

export interface Namespace {
  id: string;
  name: string;
  pods: Pod[];
  cpu: number;
  ram: number;
  storage: number;
  network: number;
  gpu: number;
  efficiency: number;
  total: number;
}

export interface Cluster {
  id: string;
  name: string;
  namespaces: Namespace[];
  cpu: number;
  ram: number;
  storage: number;
  network: number;
  gpu: number;
  efficiency: number;
  total: number;
}

export interface HierarchicalData {
  clusters: Cluster[];
}

export type TimeRange = "Today" | "Last Week" | "Last 30 Days";
