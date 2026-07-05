// Nitro config: use the Vercel preset so build output is compatible with Vercel
// scanDirs tells Nitro to scan server/api/** for route handlers
export default {
  preset: "vercel",
  scanDirs: ["server"],
};
