# Nexus - Developer Setup Guide

This guide describes how to run, configure, and develop in the Nexus workspace.

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually bundles with Node.js)

## Project Structure

- `client/`: React 19, Vite 8, TypeScript, Tailwind CSS, custom layout sheets.
- `server/`: Node.js, Express, Socket.IO, TypeScript, Yjs collaborative state.
- `docs/`: Product and project specifications, developer reference material.

---

## 1. Backend Server Setup

Navigate into the `server/` directory and configure the environment:

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the `server/` directory:
   ```env
   PORT=4000
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The backend server will run at `http://localhost:4000` with hot-reloading (nodemon + ts-node).

---

## 2. Frontend Client Setup

Navigate into the `client/` directory and run:

1. **Install dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Start the Vite dev server:**
   ```bash
   npm run dev
   ```
   The frontend application will boot at `http://localhost:5174` (or fallback to port `5173`).

---

## 3. Localization & Copy

Nexus uses a translation key-lookup system to avoid hardcoded static copy.

- **Translation File**: All text resides in [`client/src/locales/en.json`](../client/src/locales/en.json).
- **Usage**: Import the custom hook `useTranslation` to extract copy by dot-notation pathways.
  ```tsx
  import { useTranslation } from '../hooks/useTranslation';

  const MyComponent = () => {
    const { t } = useTranslation();
    return <h1>{t('hero.headline_main')}</h1>;
  };
  ```
- **Replacements**: Supports bracket token replacements:
  ```json
  "pagination_showing": "Showing {start} to {end} of {total} entries"
  ```
  ```tsx
  t('common.pagination_showing', { start: 1, end: 10, total: 100 })
  ```

---

## 4. Reusable Common Component Library

Common premium UI components are located in [`client/src/components/common/`](../client/src/components/common/):

- **Dropdown**: Customizable option selectors with smooth CSS transitions.
- **Table**: Scroll-bounded, column-templated, responsive data table.
- **Pagination**: Numbered lists with ellipsis logic and forward/backward controls.
- **Tooltip**: Element hover details with configurable positions (`top`, `bottom`, `left`, `right`).

Use these components to maintain styling consistency and reduce code duplication across pages.
