import { put, head } from '@vercel/blob';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: Request) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get or create the view count blob
    const blobName = 'portfolio-views';
    
    // Try to get existing count
    let currentCount = 0;
    try {
      const blobInfo = await head(blobName);
      if (blobInfo) {
        // Fetch the blob content
        const response = await fetch(blobInfo.url);
        if (response.ok) {
          const text = await response.text();
          currentCount = parseInt(text, 10) || 0;
        }
      }
    } catch (error) {
      // Blob doesn't exist yet, start at 0
      console.log('Creating new view counter blob');
    }

    // Increment the count
    const newCount = currentCount + 1;

    // Save the new count
    await put(blobName, newCount.toString(), {
      access: 'public',
      addRandomSuffix: false,
    });

    // Return the new count
    return new Response(JSON.stringify({ views: newCount }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error tracking views:', error);
    // Return a fallback response instead of error
    // This ensures the view counter still shows even if blob storage fails
    return new Response(JSON.stringify({ 
      views: 0,
      error: 'Failed to track views, using fallback',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 200, // Return 200 so frontend doesn't treat it as an error
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
