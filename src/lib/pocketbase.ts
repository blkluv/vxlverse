import PocketBase from "pocketbase";

// Initialize PocketBase
export const pb = new PocketBase("https://api.vxlverse.com");

// Export types for better TypeScript support
export type AuthModel = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
};

// Enable Google auth with type-safe onChange handler
pb.authStore.onChange((token, model) => {
  console.log("authStore changed", { token, model });
});
