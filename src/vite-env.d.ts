/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GTM_ID: string;
  readonly VITE_REPORTLY_WAITLIST_URL: string;
  readonly VITE_REPORTLY_NAME_ENTRY_ID: string;
  readonly VITE_REPORTLY_EMAIL_ENTRY_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
