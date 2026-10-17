# SnipScript

**A local-first desktop utility for extracting text from any region of your screen.**

SnipScript is an Electron-based desktop application designed to make on-screen text accessible and editable. It aims to simplify text extraction from sources where conventional copy-and-paste is unavailable, including video lectures, screen-shared presentations, scanned documents, and error dialogs.

The application is being developed with a focus on simplicity, speed, and privacy, with the goal of performing text recognition entirely on the user's machine.

## Overview

SnipScript is designed around a simple workflow: activate a keyboard shortcut, select a region of the screen, and obtain editable text that can be copied into any application.

The current implementation establishes the application's desktop interface, global keyboard shortcut, screen-selection overlay, and communication between Electron processes. Screen capture, optical character recognition (OCR), and clipboard integration are planned for subsequent development stages.

## Current Implementation

The application currently supports:

- **Global shortcut:** Activate screen selection using `Cmd + Shift + S`.
- **Screen-selection overlay:** Display a transparent, full-screen overlay.
- **Rectangular selection:** Select a screen region by dragging the mouse.
- **Coordinate calculation:** Determine the position and dimensions of the selected region.
- **Selection validation:** Reject selections that are too small to be useful.
- **Secure IPC communication:** Transfer selection coordinates to Electron's main process through a controlled preload bridge.

## Technology Stack

| Technology | Role |
|---|---|
| Electron | Cross-platform desktop application framework |
| Node.js | Application runtime |
| JavaScript | Application logic and interaction handling |
| HTML5 | Selection interface structure |
| CSS3 | Overlay styling and selection visualization |
| Electron IPC | Communication between application processes |

## Architecture

SnipScript uses Electron's main and renderer processes to separate desktop application management from the screen-selection interface.

The main process manages the application window, registers the global keyboard shortcut, and creates the selection window. The selection interface handles mouse interactions and calculates the selected rectangle's dimensions. A preload script exposes a restricted API through `contextBridge`, allowing the renderer to send selection coordinates to the main process through IPC.

```text
Keyboard Shortcut
       |
       v
 Electron Main Process
       |
       v
 Selection Overlay
       |
       v
 Mouse-Based Region Selection
       |
       v
 Coordinate Calculation
       |
       v
 Preload Bridge and IPC
       |
       v
 Electron Main Process
```

This architecture provides the foundation for integrating screen capture, local OCR, and clipboard functionality.

## Project Structure

```text
SnipScript/
├── main.js
└── src/
    ├── preload.js
    └── selection/
        ├── selection.html
        ├── selection.css
        └── selection.js
```

The structure represents the components implemented at the current stage of development.

## Getting Started

### Prerequisites

- macOS
- Node.js
- npm

### Installation

Clone the repository and navigate to the project directory:

```bash
git clone <repository-url>
cd SnipScript
```

Install the project dependencies:

```bash
npm install
```

Start the application:

```bash
npm start
```

Replace `<repository-url>` with the URL of your Git repository.

### Usage

1. Launch SnipScript.
2. Press `Cmd + Shift + S`.
3. Drag the mouse to select a rectangular screen region.
4. Release the mouse button to complete the selection.
5. Inspect the terminal output to verify the selected region's coordinates.

The current implementation reports the selection's position and dimensions to the Electron main process. It does not yet capture the selected pixels or extract text.

## Privacy by Design

Privacy is a core design principle of SnipScript. The intended text-extraction pipeline will process screen captures and perform OCR locally, without uploading captured images or recognized text to external servers.

The current implementation does not yet include screen capture or OCR. Local-only processing remains a requirement for those components as they are developed.

## Development Status

SnipScript is under active development. Its screen-selection mechanism and renderer-to-main-process communication have been implemented and tested.

The next development stage is to capture the selected screen region and prepare it for local text recognition. Subsequent stages will integrate OCR and clipboard support to deliver the complete text-extraction workflow.

## License

No license has been specified yet. Until a license is added to the repository, all rights remain with the copyright holder.