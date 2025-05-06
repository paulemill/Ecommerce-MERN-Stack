import { useNavigate } from 'react-router-dom';

const CancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-red-50">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md text-center">
        {/* Cancel Icon */}
        <div className="flex justify-center">
          <svg
            className="w-16 h-16 text-red-500 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* Cancel Message */}
        <h1 className="text-2xl font-bold text-gray-700 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-500 mb-6">
          Oops! It looks like your payment was not completed. Please try again.
        </p>

        {/* Button to Return Home */}
        <button
          onClick={() => navigate('/products')}
          className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition duration-200 inline-block cursor-pointer"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default CancelPage;
