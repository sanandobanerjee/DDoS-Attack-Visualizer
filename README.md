# DDoS-Attack-Visualizer

A real-time web application that visualizes simulated global DDoS attacks on an interactive world map. The app streams attack events (simulated), draws animated flows between sources and targets, and provides an intuitive view of attack volume and patterns across regions.

Repository: [sanandobanerjee/DDoS-Attack-Visualizer](https://github.com/sanandobanerjee/DDoS-Attack-Visualizer)

---

## Table of contents

- [Overview](#overview)
- [Core features](#core-features)
- [How it works (high level)](#how-it-works-high-level)
- [Tech stack](#tech-stack)
- [Running locally (fork, clone, run)](#running-locally-fork-clone-run)
- [Configuration & environment](#configuration--environment)
- [Next steps / Roadmap](#next-steps--roadmap)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License & attribution](#license--attribution)
- [Contact](#contact)

---

## Overview

This project visualizes distributed denial-of-service (DDoS) attacks as animated flows on an interactive world map. Designed as a visualization and prototyping tool, the app currently consumes simulated streaming attack events and shows animated attack lines from origin(s) to destination(s) so researchers, network operators, and students can explore attack patterns visually.

Use cases:
- Rapid prototyping and UX exploration for security dashboards
- Demonstrating DDoS geospatial patterns in talks or teaching
- Testing visual encodings for attack intensity and provenance

---

## Core features

- Interactive world map with pan & zoom (mouse / touch)
- Animated attack flows/arcs between origin and destination regions
- Simulated streaming of attack data to demonstrate the real-time visualization
- Lightweight UI to toggle or control simulation (where applicable)
- Responsive layout suitable for most desktop and tablet screens

---

## How it works (high level)

- A data producer (currently a simulator built into the app) emits attack events. Each event contains source coordinates/region, destination coordinates/region, and metadata such as intensity or packet rate.
- The front-end receives events and renders animated arcs/lines between the source and destination on the map.
- Visual encodings (line width, speed, opacity) reflect relative intensity of attacks so heavy attacks appear more prominent.
- Hovering and interaction hooks are prepared to show per-region or per-flow details; currently basic information can be displayed, and the hover/detail enhancements are part of the planned next steps.

---

## Tech stack

- Framework: Next.js (TypeScript)
- Languages: TypeScript, JavaScript, CSS (Tailwind or equivalent styles if present)
- Map & visualization: (map library + canvas/SVG-based rendering — see code for the exact implementation details)
- Package manager: npm (package-lock.json included)

(For exact library names and versions, consult `package.json`.)

---

## Running locally (fork, clone, run)

These steps let you run the app locally from your fork. This project uses a typical Next.js + Node setup.

1. Fork the repository
   - Click "Fork" on the GitHub repository page: [https://github.com/sanandobanerjee/DDoS-Attack-Visualizer](https://github.com/sanandobanerjee/DDoS-Attack-Visualizer)

2. Clone your fork
   - Using HTTPS:
     - git clone https://github.com/<your-username>/DDoS-Attack-Visualizer.git
   - Or using SSH:
     - git clone git@github.com:<your-username>/DDoS-Attack-Visualizer.git
   - Then:
     - cd DDoS-Attack-Visualizer

3. Install dependencies
   - Recommended Node: 18.x or later
   - npm (bundled with Node) should be fine
   - Run:
     - npm install

4. Start the development server
   - npm run dev
   - Open http://localhost:3000 in your browser

5. Build and run production locally
   - npm run build
   - npm start
   - By default, the app will run on port 3000 unless configured otherwise.

Notes:
- If you prefer Yarn:
  - yarn
  - yarn dev
- If you encounter missing packages or lockfile mismatches, remove `node_modules` and run the install command again.

---

## Configuration & environment

- Currently the app uses simulated attack data by default, so no external API keys or data sources are required to run the demo.
- If you wire in real telemetry later, environment variables (API keys, stream endpoints) may be needed. Add instructions and an example `.env.example` at that time.

---

## Next steps / Roadmap

Planned features (as discussed):

1. Implement real data
   - Integrate a real-time feed (e.g., Kafka, WebSocket, or an HTTP push endpoint) that provides actual attack telemetry. This will allow the visualizer to show live attack traffic from a collection pipeline or partner feed.
   - Add configuration and retry logic for stable production streaming.

2. Color-code attack lines
   - Assign meaningful color scales to attack flows to encode attributes such as:
     - Attack type/protocol
     - Severity/intensity (e.g., packet rate, bandwidth)
     - Age of the attack (recent vs. old)
   - Add a legend and color-blind friendly palettes.

3. Enhance hover and detail views
   - On hover over a region or flow, show a detail card with:
     - IP / ASN / region name (if available)
     - Aggregate attack counts and peak intensity
     - Time-series sparkline for the last N minutes
     - Link-out to raw logs or the incident tracking system
   - Support click-to-pin a region detail for further inspection.

Other improvements:
- Performance tuning for a high-volume stream (batching updates, canvas rendering, LOD)
- Filtering and search (by ASN, country, or IP range)
- Export snapshots and video/GIF recording for reports

---

## Contributing

Contributions are welcome! A few suggested ways to help:
- File issues for bugs or feature requests
- Open pull requests for small improvements (UI, tests, docs)
- Implement one of the roadmap items (e.g., color coding or hover details)

Guidelines:
- Keep changes small and focused
- Follow the TypeScript linting and formatting used by the repo
- Add documentation for any new environment variables or external services

---

## Troubleshooting

- If the server won't start:
  - Ensure Node.js version is compatible (Node 18+ recommended).
  - Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
  - Check console for errors when running `npm run dev`.

- If visualization looks blank:
  - Verify the app log shows simulation events being generated.
  - Check browser console for SVG/canvas rendering errors.

---

## Contact

Owner: [sanandobanerjee](https://github.com/sanandobanerjee)

If you want help implementing any of the roadmap features (real data, color-coding, hover details), open an issue describing the desired integration and I can propose an implementation plan or example PR.

---