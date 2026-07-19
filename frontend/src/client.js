import { createThirdwebClient } from "thirdweb";

// You should define VITE_THIRDWEB_CLIENT_ID in your .env file
const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID || "b22f99ff9d6600c6d91f24d9c49a6568"; // dummy default client ID for testing, replace with yours

export const client = createThirdwebClient({
  clientId: clientId,
});
