# BST Visualizer

An interactive **Binary Search Tree (BST)** visualizer inspired by [VisualGo BST](https://visualgo.net/en/bst). Built with React, TypeScript, and Vite.

![BST Visualizer](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4)

## Overview

This project is a clone of the BST visualization from [visualgo.net/en/bst](https://visualgo.net/en/bst). It provides an animated, interactive canvas for exploring BST operations — insertion, deletion, searching, traversal, and more — with step-by-step pseudocode highlighting and visual feedback.

## Features

- **Interactive SVG Tree Canvas** — pan (drag) and zoom (scroll wheel) to navigate large trees
- **Step-by-step Animation** — watch each operation traverse the tree node-by-node with color-coded highlights:
  - **Amber** — visited nodes
  - **Red** — currently active/comparing node
  - **Green** — result found
- **Pseudocode Panel** — displays algorithm pseudocode with the current line highlighted during animation
- **Operations Panel** with sub-menus for:
  - **Create** — empty tree, random BST (N nodes), or skewed tree
  - **Search(v)** — exact search, lower bound, min, max
  - **Insert(v)** — insert a value with animated traversal
  - **Remove(v)** — delete a value (handles leaf, one-child, and two-child cases via in-order successor)
  - **Predecessor / Successor(v)**
  - **Select(k)** — find the k-th smallest element
  - **Traverse(root)** — inorder, preorder, postorder
- **Immutable BST Data Structure** — all tree mutations return new trees, making state management clean and predictable
- **Responsive Layout** — collapsible operations and info panels

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [React 19](https://react.dev/) |
| Language | [TypeScript 5.9](https://www.typescriptlang.org/) |
| Build Tool | [Vite 7](https://vite.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev/) |
| UI Primitives | [Radix UI](https://www.radix-ui.com/), [Base UI](https://base-ui.com/) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm (or yarn / pnpm)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd internship-tasks

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── App.tsx                        # Root component
├── main.tsx                       # Entry point
├── components/
│   ├── controls/
│   │   ├── InfoPanel.tsx          # Pseudocode & status display panel
│   │   └── OperationsPanel.tsx    # BST operations menu (create, search, insert, remove, etc.)
│   ├── layout/
│   │   ├── Header.tsx             # Top bar
│   │   ├── BottomBar.tsx          # Bottom bar
│   │   └── RootLayout.tsx         # Main layout wrapper
│   └── tree/
│       └── TreeCanvas.tsx         # SVG-based tree rendering with pan/zoom
├── hooks/
│   ├── BSTAnimationContext.ts     # React context type definitions
│   ├── useBSTAnimation.tsx        # Animation provider & state management
│   └── useBSTAnimationHook.tsx    # Context consumer hook
└── utils/
    └── bst.ts                     # BST data structure, layout computation, search/remove step generators, pseudocode
```

## How It Works

1. **BST Data Structure** (`bst.ts`) — A pure, immutable BST implementation. Insert and remove return new tree references. Layout positions are computed via in-order traversal (x-axis) and depth (y-axis).

2. **Animation Steps** — Each operation (search, insert, remove, etc.) generates an array of `SearchStep` objects describing the node visited, status text, and which pseudocode line to highlight.

3. **Provider** (`useBSTAnimation.tsx`) — A React context provider manages tree state, animation playback (timed `setTimeout` chains), and panel visibility.

4. **Tree Canvas** (`TreeCanvas.tsx`) — Renders the tree as SVG with edges and circular nodes. Supports mouse-drag panning and scroll-wheel zooming. Node colors update reactively based on animation state.

5. **Panels** — The `OperationsPanel` exposes all BST operations with input fields. The `InfoPanel` shows real-time pseudocode with line highlighting and a status message during animation.

## Acknowledgements

- [VisualGo](https://visualgo.net/en/bst) — the original BST visualization this project is based on
- [Dr. Steven Halim](https://www.comp.nus.edu.sg/~stevenha/) — creator of VisualGo
