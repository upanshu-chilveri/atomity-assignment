import type { Cluster, Namespace, Pod } from "../types/clusterData";

// JSONPlaceholder Typings
interface User {
  id: number;
  name: string;
}

interface Post {
  id: number;
  userId: number;
  title: string;
}

interface Album {
  id: number;
  userId: number;
  title: string;
}

// ─────────────────────────────────────────────
// Pricing Constants (Hourly base rate)
// ─────────────────────────────────────────────
const COST_CPU = 0.02;
const COST_RAM = 0.01;
const COST_STORAGE = 0.005;
const COST_NETWORK = 0.003;
const COST_GPU = 0.05;

/** Deterministic pseudo-random number generator based on ID */
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

/** Generate realistic mock resources bounds and compute exact hourly cost */
function generatePodResources(podId: number): Omit<Pod, "id" | "name"> {
  // Generate random units
  const cpuUnits = Math.floor(seededRandom(podId) * 31) + 1; // 1-32 cores
  const ramGB = Math.floor(seededRandom(podId + 1) * 127) + 1; // 1-128 GB
  const storageGB = Math.floor(seededRandom(podId + 2) * 990) + 10; // 10-1000 GB
  const networkGB = Math.floor(seededRandom(podId + 3) * 490) + 10; // 10-500 GB
  const gpuUnits = Math.floor(seededRandom(podId + 4) * 4); // 0-3 GPUs
  const efficiency = Math.floor(seededRandom(podId + 5) * 40) + 60; // 60-99%

  // Calculate strict cost model
  const cpu = Number((cpuUnits * COST_CPU).toFixed(2));
  const ram = Number((ramGB * COST_RAM).toFixed(2));
  const storage = Number((storageGB * COST_STORAGE).toFixed(2));
  const network = Number((networkGB * COST_NETWORK).toFixed(2));
  const gpu = Number((gpuUnits * COST_GPU).toFixed(2));

  // Sum total cost
  const total = Number((cpu + ram + storage + network + gpu).toFixed(2));

  return { cpu, ram, storage, network, gpu, efficiency, total };
}

/**
 * Fetch simulated hierarchical cloud infrastructure dataset
 * 
 * Maps flat REST JSONPlaceholder entities:
 * Users -> Clusters
 * Posts -> Namespaces
 * Albums -> Pods
 */
export async function fetchInfrastructureData(): Promise<Cluster[]> {
  const [usersRes, postsRes, albumsRes] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/users"),
    fetch("https://jsonplaceholder.typicode.com/posts"),
    fetch("https://jsonplaceholder.typicode.com/albums"),
  ]);

  const users: User[] = await usersRes.json();
  const posts: Post[] = await postsRes.json();
  const albums: Album[] = await albumsRes.json();

  // Dictionary for O(1) loop lookups
  const postsByUserId: Record<number, Post[]> = {};
  for (const post of posts) {
    if (!postsByUserId[post.userId]) postsByUserId[post.userId] = [];
    postsByUserId[post.userId].push(post);
  }

  const albumsByUserId: Record<number, Album[]> = {};
  for (const album of albums) {
    if (!albumsByUserId[album.userId]) albumsByUserId[album.userId] = [];
    albumsByUserId[album.userId].push(album);
  }

  const clusters: Cluster[] = users.map((user) => {
    const userPosts = postsByUserId[user.id] || [];
    const userAlbums = albumsByUserId[user.id] || [];

    // Distribute user's albums roughly evenly across their namespaces (posts)
    const namespaces: Namespace[] = userPosts.slice(0, 5).map((post, postIndex) => {
      // Limit to 5 namespaces and 5 pods per namespace to keep realistic UI constraints
      const namespaceAlbums = userAlbums.slice(postIndex * 3, (postIndex * 3) + 3);

      const pods: Pod[] = namespaceAlbums.map((album) => {
        const resources = generatePodResources(album.id);
        return {
          id: `pod-${album.id}`,
          name: album.title.split(" ").slice(0, 2).join("-"),
          ...resources,
        };
      });

      // Aggregate Namespace totals
      const nsTotals = pods.reduce(
        (acc, pod) => ({
          cpu: acc.cpu + pod.cpu,
          ram: acc.ram + pod.ram,
          storage: acc.storage + pod.storage,
          network: acc.network + pod.network,
          gpu: acc.gpu + pod.gpu,
          total: acc.total + pod.total,
          efficiency: acc.efficiency + pod.efficiency,
        }),
        { cpu: 0, ram: 0, storage: 0, network: 0, gpu: 0, total: 0, efficiency: 0 }
      );

      // Average the efficiency up the chain
      const avgEfficiency = pods.length > 0 ? Math.round(nsTotals.efficiency / pods.length) : 0;

      return {
        id: `ns-${post.id}`,
        name: post.title.split(" ").slice(0, 2).join("-"),
        pods,
        cpu: Number(nsTotals.cpu.toFixed(2)),
        ram: Number(nsTotals.ram.toFixed(2)),
        storage: Number(nsTotals.storage.toFixed(2)),
        network: Number(nsTotals.network.toFixed(2)),
        gpu: Number(nsTotals.gpu.toFixed(2)),
        total: Number(nsTotals.total.toFixed(2)),
        efficiency: avgEfficiency,
      };
    });

    // Aggregate Cluster Totals
    const clusterTotals = namespaces.reduce(
      (acc, ns) => ({
        cpu: acc.cpu + ns.cpu,
        ram: acc.ram + ns.ram,
        storage: acc.storage + ns.storage,
        network: acc.network + ns.network,
        gpu: acc.gpu + ns.gpu,
        total: acc.total + ns.total,
        efficiency: acc.efficiency + ns.efficiency,
      }),
      { cpu: 0, ram: 0, storage: 0, network: 0, gpu: 0, total: 0, efficiency: 0 }
    );

    const avgClusterEfficiency = namespaces.length > 0 ? Math.round(clusterTotals.efficiency / namespaces.length) : 0;

    return {
      id: `cluster-${user.id}`,
      name: `Cluster ${user.name.split(" ").map(n => n[0]).join("")}`,
      namespaces,
      cpu: Number(clusterTotals.cpu.toFixed(2)),
      ram: Number(clusterTotals.ram.toFixed(2)),
      storage: Number(clusterTotals.storage.toFixed(2)),
      network: Number(clusterTotals.network.toFixed(2)),
      gpu: Number(clusterTotals.gpu.toFixed(2)),
      total: Number(clusterTotals.total.toFixed(2)),
      efficiency: avgClusterEfficiency,
    };
  });

  return clusters;
}
