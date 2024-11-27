import PocketBase from "pocketbase";

export const pb = new PocketBase("https://api.findasb.com");

// Enable Google auth
pb.authStore.onChange(() => {
  console.log("authStore changed", pb.authStore.model);
});
