import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Snapify</h1>
        <p className="text-xl text-gray-600">Create and share photo events with your friends</p>
      </header>
      
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Get Started</h2>
          
          <div className="space-y-4">
            <Link 
              href="/events/create" 
              className="block w-full py-2 px-4 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700"
            >
              Create New Event
            </Link>
            
            <Link
              href="/events/join"
              className="block w-full py-2 px-4 bg-gray-200 text-center rounded-md hover:bg-gray-300"
            >
              Join Existing Event
            </Link>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">How it works</h2>
          
          <ol className="list-decimal pl-5 space-y-2">
            <li>Create a photo event with a unique code</li>
            <li>Share the code with your friends</li>
            <li>Everyone uploads photos to the same gallery</li>
            <li>View and download all photos in one place</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
