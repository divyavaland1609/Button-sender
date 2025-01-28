import { defineConfig } from "vite";
// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react()],
  server: {
    port: 2000, // Change this to a different port number
    host: "0.0.0.0", // Optional: allows access from other devices on the network
    strictPort: true, // Ensures that Vite will not try to use another port if the specified one is occupied
  },
});

