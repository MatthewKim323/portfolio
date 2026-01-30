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
      if (blobInfo && blobInfo.url) {
        // Fetch the blob content
        const response = await fetch(blobInfo.url);
        if (response.ok) {
          const text = await response.text();
          currentCount = parseInt(text, 10) || 0;
          console.log(`Retrieved existing count: ${currentCount}`);
        } else {
          console.log(`Failed to fetch blob content: ${response.status}`);
        }
      } else {
        console.log('Blob does not exist yet, starting at 0');
      }
    } catch (error) {
      // Blob doesn't exist yet, start at 0
      console.log('Creating new view counter blob:', error instanceof Error ? error.message : 'Unknown error');
    }

    // Increment the count
    const newCount = currentCount + 1;
    console.log(`Incrementing count from ${currentCount} to ${newCount}`);

    // Save the new count
    const putResult = await put(blobName, newCount.toString(), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true, // Allow overwriting the existing blob to update the count
    });
    console.log(`Saved new count: ${newCount}, blob URL: ${putResult.url}`);

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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error details:', { errorMessage, errorStack });
    
    // Return error details for debugging, but still return a response
    return new Response(JSON.stringify({ 
      views: 0,
      error: 'Failed to track views',
      details: errorMessage
    }), {
      status: 200, // Return 200 so frontend doesn't treat it as an error
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
