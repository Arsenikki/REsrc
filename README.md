## Idea

REsrc - resource monitor provides simple visualization of the system resource usage, focusing on process-specific CPU and memory metrics. The goal is to have this tool running alongside the main application using Kubernetes sidecar pattern, allowing user to visualize process resource usage over time.

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to access the service.

## TODO

* Containerization
* Creating deployment manifest
* Process selection, as currently first process that is received is always shown