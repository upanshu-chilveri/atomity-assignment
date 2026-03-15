# Atomity Frontend Assignment

This repository contains my implementation for the Atomity frontend engineering assignment. The goal of this project was to build a responsive and interactive interface while demonstrating thoughtful architecture, animation design, data management, and maintainable styling.

### Deployment Link: https://atomity-assignment-od7bzx2tn-upanshu-chilveris-projects.vercel.app

## Feature Chosen

The implemented feature focuses on building a hierarchical cloud resource visualization where users can drill down through:

Cluster → Namespace → Pods

This structure mirrors real-world Kubernetes infrastructure where resources are organized in nested layers. I chose this feature because it demonstrates:

- Handling nested datasets
- Implementing interactive drill-down tables
- Managing UI state across multiple hierarchy levels
- Maintaining performance while rendering dynamic data

Since Atomity builds tools for analyzing and optimizing cloud workloads, visualizing infrastructure hierarchies felt aligned with the platform’s real-world use cases.

## Approach to Animation

Animations were implemented to make transitions between hierarchy levels intuitive and visually smooth.

The animation strategy focused on:

- **Subtle transitions instead of heavy motion**
- Maintaining **perceived performance**
- Ensuring animations do not block data rendering
- Using recharts insteda of charts.js to render SVG directly

Animations were intentionally lightweight to avoid degrading performance in large datasets.

## Libraries Used

### React

### TypeScript

### Tailwind CSS

### Framer Motion

### React-Query

###  Recharts

## What I Would Improve With More Time

If more time were available, I would expand the project in several areas.

### 1. Advanced Filtering
Add filtering by resource usage, namespace, or cluster metadata.

### 2. Loading States and Skeletons
Improve user feedback while asynchronous data loads.

### 3. Real Backend Integration
Replace mock datasets with live APIs connected to cloud usage analytics.

### 4. More fluid Animations of Chart elements 
The chart elements animations can be tweaked and improved to look more cohesive with the webiste, making it more pleasing on the eye.

