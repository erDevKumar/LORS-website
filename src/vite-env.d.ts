/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTACT_EMAIL: string;
  readonly VITE_ROUTEMATES_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
