import { useContext, useState, useEffect } from 'react';
import { Context } from '../Context';
import CartSummary from '../pages/CartSummary';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const CartIcon = () => {
  const { user, fetchCart, cartSummary } = useContext(Context); // Access cartSummary and User Context
  const [isModalOpen, setIsModalOpen] = useState(false); // Used for the modal feature
  const navigate = useNavigate(); // Used for navigation

  const totalItems = cartSummary.items.length;

  //////////////////////////////////////////////////////////////
  // HANDLE THE MODAL FEATURE
  //////////////////////////////////////////////////////////////

  const handleModalToggle = () => {
    if (!user) {
      toast.error('Please login to continue');
      // Redirect to login if not logged in
      navigate('/login');
    } else {
      // Toggle modal if logged in
      setIsModalOpen(!isModalOpen);
      fetchCart();
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      document.body.style.overflow = ''; // Enable scrolling
    }

    // Cleanup to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  //////////////////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////////////////
  return (
    <>
      <div className="m-8">
        {/* Cart Button */}
        <div
          onClick={handleModalToggle}
          className="relative text-gray-700 text-base font-semibold hover:text-blue-600 transition duration-300 group cursor-pointer"
        >
          <span>Cart</span>

          {
            <span className="absolute -top-3 -right-5 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          }

          {/* Underline Animation */}
          <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 backdrop-blur-xs flex justify-center items-center z-50 p-4"
            onClick={handleModalToggle}
          >
            <div
              className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <div className="p-4">
                <CartSummary handleModalToggle={handleModalToggle} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartIcon;
