// This file provides TypeScript with type definitions for the environment variables
// that are exposed to the client-side code via Vite's `define` config in `vite.config.ts`.

// FIX: To avoid redeclaring the global 'process' variable, which can conflict with
// type definitions from Node.js, this file is updated to augment the existing
// global `NodeJS.ProcessEnv` interface. This safely adds the `API_KEY` type
// to `process.env` without causing declaration conflicts.
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}
