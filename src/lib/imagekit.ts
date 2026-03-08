import ImageKit from "@imagekit/nodejs";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
});


export async function deleteFileFromImageKit(url: string) {
  if (!url || !url.includes("imagekit.io")) {

    return;
  }

  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const filePath = "/" + pathParts.slice(2).join("/");
    const fileName = pathParts[pathParts.length - 1];

    const result = await imagekit.assets.list({
      searchQuery: `name = "${fileName}"`,
    });

    if (result && result.length > 0) {
      const asset = result.find((a: any) => a.filePath === filePath) as any;
      if (asset && asset.fileId) {
        await imagekit.files.delete(asset.fileId);
        
        try {
          await imagekit.cache.invalidation.create({ url });
        } catch (purgeError) {
          console.warn(`[ImageKit] CDN cache purge failed (non-critical):`, purgeError);
        }
        
        return { success: true };
      }
    }
    
    console.warn(`File not found in ImageKit for path: ${filePath}`);
    return { success: false, error: "File not found" };
  } catch (error) {
    console.error("Error deleting file from ImageKit:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
