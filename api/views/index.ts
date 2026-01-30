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
    
    // Try to get existing count with timeout
    let currentCount = 0;
    try {
      console.log('Attempting to get blob info...');
      const blobInfo = await Promise.race([
        head(blobName),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('head() timeout after 5s')), 5000)
        )
      ]) as Awaited<ReturnType<typeof head>>;
      
      if (blobInfo && blobInfo.url) {
        console.log('Blob exists, fetching content...');
        const response = await fetch(blobInfo.url, {
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
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
      // Blob doesn't exist yet or timeout, start at 0
      console.log('Error getting blob (will start at 0):', error instanceof Error ? error.message : 'Unknown error');
    }

    // Increment the count
    const newCount = currentCount + 1;
    console.log(`Incrementing count from ${currentCount} to ${newCount}`);

    // Save the new count with timeout
    console.log('Attempting to save blob...');
    const putResult = await Promise.race([
      put(blobName, newCount.toString(), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('put() timeout after 5s')), 5000)
      )
    ]) as Awaited<ReturnType<typeof put>>;
    
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
