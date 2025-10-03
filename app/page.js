import Reel from '@/components/Reel';

async function getReels() {
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/reels`, { cache: 'no-store' });

  if (!res.ok) {
    // This will be caught by the error boundary
    throw new Error('Failed to fetch reels');
  }

  const data = await res.json();
  return data.reels;
}

export default async function HomePage() {
  let reels = [];
  let error = null;

  try {
    reels = await getReels();
  } catch (e) {
    error = e.message;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <p>Could not load reels. Please try again later.</p>
      </div>
    );
  }

  return (
    <main className="relative h-screen overflow-auto snap-y snap-mandatory">
      {reels.length > 0 ? (
        reels.map((reel) => <Reel key={reel._id} reel={reel} />)
      ) : (
        <div className="flex justify-center items-center h-screen bg-black text-white">
          <p>No reels to display.</p>
        </div>
      )}
    </main>
  );
}