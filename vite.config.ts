import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import {
  CAREERS_APPLY_PATH,
  CAREERS_GOOGLE_FORM_URL,
} from "./config/careers-form.mjs";

function careersApplyRedirect(): Plugin {
  const handler = (
    _req: import("http").IncomingMessage,
    res: import("http").ServerResponse,
    next: () => void
  ) => {
    if (_req.url?.split("?")[0] !== CAREERS_APPLY_PATH) {
      next();
      return;
    }
    res.writeHead(302, { Location: CAREERS_GOOGLE_FORM_URL });
    res.end();
  };

  return {
    name: "careers-apply-redirect",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig({
  plugins: [react(), careersApplyRedirect()],
});
