import { ASSET_BASE_URL } from "./data";

export function getFirstImage(assets: string[]): string {
  console.log("ASSETS", assets);
  const asset = assets.find(
    (item) =>
      item.endsWith(".jpeg") ||
      item.endsWith(".jpg") ||
      item.endsWith(".png") ||
      item.endsWith(".webp"),
  );
  console.log("ASSET", asset);
  if (asset) return `${ASSET_BASE_URL}${asset}`;
  return "";
}
