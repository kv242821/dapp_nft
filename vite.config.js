import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/dapp_nft/",
  plugins: [react(), nodePolyfills()],
  server: {
    port: 3000,
  },
  define: {
    "process.env": {},
  },
});
