const Pagination = ({ page, setPage, totalPages }) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0, // Scroll to the top of the page
      behavior: 'smooth', // Smooth scrolling effect
    });
  };

  // params to be used on ProductPage page
  return (
    <div className="flex justify-center items-center space-x-5 my-10">
      {/* Previous Button */}
      <button
        className={`w-10 h-10 flex items-center justify-center rounded-md border ${
          page === 1
            ? 'text-gray-400 border-gray-300 cursor-not-allowed bg-white'
            : 'text-gray-700 border-gray-300 hover:border-gray-500 hover:bg-gray-100'
        }`}
        onClick={() => {
          setPage((prev) => prev - 1);
          scrollToTop();
        }}
        disabled={page === 1}
      >
        ←
      </button>

      {/* Page Info */}
      <p className="text-lg text-gray-700">
        Page <span className="font-bold">{page}</span> of{' '}
        <span className="font-bold">{totalPages}</span>
      </p>

      {/* Next Button */}
      <button
        className={`w-10 h-10 flex items-center justify-center rounded-md border ${
          page === totalPages
            ? 'text-gray-400 border-gray-300 cursor-not-allowed bg-white'
            : 'text-gray-700 border-gray-300 hover:border-gray-500 hover:bg-gray-100'
        }`}
        onClick={() => {
          setPage((prev) => prev + 1);
          scrollToTop();
        }}
        disabled={page === totalPages}
      >
        →
      </button>
    </div>
  );
};

export default Pagination;
