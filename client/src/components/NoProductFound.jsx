const NoProductFound = () => {
  return (
    <div className="mt-20 flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        No Product Found
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Sorry, we couldn't find any products matching your search.
      </p>
      <button
        onClick={() => window.location.reload()} // to refresh the page
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
      >
        Refresh Page
      </button>
    </div>
  );
};

export default NoProductFound;
