import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../Context';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const SuccessPage = () => {
  const { cartSummary, setCartSummary } = useContext(Context);
  const navigate = useNavigate();

  const handleReturnHome = async () => {
    if (!cartSummary.items || cartSummary.items.length === 0) {
      console.error('Cart is empty');
      navigate('/products');
      return;
    }

    try {
      const orderData = {
        items: cartSummary.items,
        totalAmount: cartSummary.subTotal + cartSummary.tax + 10,
        tax: cartSummary.tax,
        shipping: 10,
      };

      console.log('Storing order data:', orderData);

      await axios.post('/.netlify/functions/storeOrders', orderData, {
        withCredentials: true,
      });

      await axios.delete('/.netlify/functions/clearCart', {
        withCredentials: true,
      });

      setCartSummary({
        items: [],
        subTotal: 0,
        tax: 0,
        shipping: 0,
        totalAmount: 0,
      });

      toast.success('Order complete! Redirecting...', {
        duration: 3000,
        style: {
          border: '1px solid #4ade80',
          padding: '16px',
          color: '#166534',
        },
        iconTheme: {
          primary: '#4ade80',
          secondary: '#ecfdf5',
        },
      });

      setTimeout(() => navigate('/products'), 3000);
    } catch (error) {
      console.error('Error storing order or clearing cart:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-bold text-green-500 mb-4">
          Payment Successful! 🎉
        </h1>
        <p className="text-gray-700 mb-6">
          Thank you for your order. We have received your payment.
        </p>
        <button
          onClick={handleReturnHome}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
