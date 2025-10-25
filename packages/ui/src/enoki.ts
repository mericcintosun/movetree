import { EnokiFlowProvider } from "@mysten/enoki/react";

export const enokiFlowConfig = {
  apiUrl:
    import.meta.env.VITE_ENOKI_API_URL || "https://api.enoki.mystenlabs.com",
  apiKey: import.meta.env.VITE_ENOKI_API_KEY,
};
