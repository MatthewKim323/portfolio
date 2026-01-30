import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export default async (req: Request, context: Context) => {
  // Only allow GET requests
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Get the store for view counts
    const store = getStore("views");

    // Get current count or default to 0
    const currentCount = await store.get("total", { type: "json" }) || 0;

    // Increment the count
    const newCount = (currentCount as number) + 1;

    // Save the new count
    await store.set("total", JSON.stringify(newCount));

    // Return the new count
    return new Response(JSON.stringify({ views: newCount }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error tracking views:", error);
    return new Response(JSON.stringify({ error: "Failed to track views" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
