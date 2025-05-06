import { Context } from '../Context';
import { useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

//////////////////////////////////////////////////////////////
// useReducer TO HANDLE DELETE, CLEAR, ADD AND SUBTRACT QUANTITY
//////////////////////////////////////////////////////////////

const CartSummary = ({ handleModalToggle }) => {
  //add params for the handleModalToggle on the CartIcon component

  const { cartSummary, fetchCart, user } = useContext(Context); // Access in on the context

  //////////////////////////////////////////////////////////////
  // FUNCTION FOR STRIPE during onclick
  //////////////////////////////////////////////////////////////

  const checkout = async () => {
    // Prepare the payload for Stripe
    const stripePayload = [
      // Map cart items to Stripe line items
      ...cartSummary.items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title, // Product name
          },
          unit_amount: Math.round((item.price * 100) / item.quantity), // Convert price to cents
        },
        quantity: item.quantity,
      })),

      // Add tax as a separate line item
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax',
          },
          unit_amount: Math.round(cartSummary.tax * 100), // Convert tax to cents
        },
        quantity: 1,
      },

      // Add shipping fee as a separate line item
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping Fee',
          },
          unit_amount: Math.round(cartSummary.shipping * 100), // Convert shipping fee to cents
        },
        quantity: 1,
      },
    ];

    try {
      // Make the POST request to the Netlify function
      const { data } = await axios.post('/.netlify/functions/stripeCheckout', {
        items: stripePayload, // Send the stripePayload to the server
      });

      // If the session URL is returned, redirect the user to the Stripe checkout page
      if (data.url) {
        window.location.assign(data.url);
      }
    } catch (error) {
      // Handle errors if any during the checkout process
      console.error('Checkout error:', error);
    }
  };

  console.log('cartSummary', cartSummary);

  //////////////////////////////////////////////////////////////
  // HANDLE DELETE
  //////////////////////////////////////////////////////////////

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to remove this item from your cart?'
    );
    if (!confirmDelete) return;

    try {
      await axios.delete('/.netlify/functions/removeFromCart', {
        data: { productId },
        withCredentials: true,
      });

      // Update the cart summary in the context
      fetchCart(); // Fetch the updated cart summary
      alert('Item removed from cart!');
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  //////////////////////////////////////////////////////////////
  // CLEAR CART
  //////////////////////////////////////////////////////////////

  const handleClearCart = async () => {
    const confirmClear = window.confirm(
      'Are you sure you want to clear the cart?'
    );
    if (!confirmClear) return;

    try {
      await axios.delete('/.netlify/functions/clearCart', {
        withCredentials: true,
      });

      // Update the cart summary in the context
      fetchCart(); // Fetch the updated cart summary
      alert('Cart cleared!');
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  //////////////////////////////////////////////////////////////
  // ADD QUANTITY
  //////////////////////////////////////////////////////////////
  const handleAddQuantity = async (productId) => {
    const existingItem = cartSummary.items.find(
      (item) => item.productId === productId
    );
    const newQuantity = (existingItem?.quantity || 1) + 1;
    try {
      await axios.put(
        '/.netlify/functions/updateCart',
        {
          productId,
          quantity: newQuantity,
        },
        { withCredentials: true }
      );

      // Update the cart summary in the context
      fetchCart(); // Fetch the updated cart summary
    } catch (error) {
      console.error('Failed to add quantity:', error);
    }
  };

  //////////////////////////////////////////////////////////////
  // SUBTRACT QUANTITY
  //////////////////////////////////////////////////////////////
  const handleSubtractQuantity = async (productId) => {
    const existingItem = cartSummary.items.find(
      (item) => item.productId === productId
    );
    const newQuantity = (existingItem?.quantity || 1) - 1;
    try {
      await axios.put(
        '/.netlify/functions/updateCart',
        {
          productId,
          quantity: newQuantity,
        },
        { withCredentials: true }
      );

      // Update the cart summary in the context
      fetchCart(); // Fetch the updated cart summary
    } catch (error) {
      console.error('Failed to subtract quantity:', error);
    }
  };

  //////////////////////////////////////////////////////////////
  // Functions to format numbers
  //////////////////////////////////////////////////////////////

  // Format the prices
  const formatPrice = (price) => {
    if (isNaN(price) || price == null) {
      return '0.00'; // Default to "0.00" if price is invalid
    }
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Calculate subtotal, tax, and total price
  const rawSubTotalPrice = cartSummary.subTotal;
  const subTotalPrice = formatPrice(rawSubTotalPrice);
  const tax = rawSubTotalPrice * 0.1;
  const formattedTax = formatPrice(tax);
  const shippingFee = cartSummary.items.length > 0 ? 10 : 0;
  const total = rawSubTotalPrice + tax + shippingFee;
  const formattedTotal = formatPrice(total);

  const defaultAddress = user?.address?.find(
    (addr) => addr.isDefaultShippingAddress
  );

  //////////////////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////////////////
  return (
    <>
      <div className="bg-gray-100 min-h-[55vh] p-8 flex justify-center rounded-xl">
        <div className="w-full max-w-3xl">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold">Shopping Cart</h1>
            <button
              onClick={handleModalToggle}
              className="text-gray-500 hover:text-black text-2xl cursor-pointer active:scale-95 transition-transform duration-150"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Cart Items Section */}
            <div className="col-span-1 bg-gray-50 shadow-lg rounded-xl p-6 sm:p-8 overflow-auto relative max-h-139">
              {/* Empty Cart Message */}
              {cartSummary.items.length === 0 && (
                <div className="text-center text-gray-600">
                  Your cart is empty.
                </div>
              )}

              {/* Cart Items */}
              {cartSummary.items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white grid grid-cols-1 lg:grid-cols-2 py-4 px-4 text-left rounded-lg shadow-lg mb-4"
                >
                  {/* Product Image & Name */}
                  <div className="w-full flex justify-center items-center overflow-hidden rounded-lg bg-white">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 sm:w-18 object-contain rounded-lg"
                    />
                  </div>

                  {/* Right Portion - Product detail and quantity */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mt-2 truncate overflow-hidden">
                      {item.title}
                    </p>
                    <p className="text-sm font-semibold text-blue-500 mt-2">
                      ${formatPrice(item.price)}
                    </p>

                    {/* Quantity Control and Delete Button */}
                    <div className="flex items-center justify-between">
                      {/* Quantity Control - Left */}
                      <div className="flex items-center gap-3 mt-4">
                        <button
                          className={`w-6 h-6 border rounded-md flex items-center justify-center ${
                            item.quantity === 1
                              ? 'cursor-not-allowed'
                              : 'hover:bg-gray-200 cursor-pointer '
                          } active:scale-95 transition-transform duration-150`}
                          onClick={() => handleSubtractQuantity(item.productId)}
                          disabled={item.quantity === 1}
                        >
                          -
                        </button>

                        <p className="text-sm">{item.quantity}</p>

                        <button
                          className="w-6 h-6 border rounded-md flex items-center justify-center hover:bg-gray-200 cursor-pointer active:scale-95 transition-transform duration-150"
                          onClick={() => handleAddQuantity(item.productId)}
                        >
                          +
                        </button>
                      </div>

                      {/* Delete Button - Right */}
                      <button
                        onClick={() => handleDelete(item.productId)}
                        className="cursor-pointer mr-2 mt-4 active:scale-95 transition-transform duration-150"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              {cartSummary.items.length > 0 && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleClearCart}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-200 cursor-pointer"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </div>

            {/* Summary Section */}
            <div className="bg-white shadow-lg rounded-xl p-6 sm:p-8 h-fit">
              <h2 className="text-lg font-semibold mb-6">Summary</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>${subTotalPrice}</p>
                </div>
                <div className="flex justify-between">
                  <p>Taxes</p>
                  <p>${formattedTax}</p>
                </div>
                <div className="flex justify-between">
                  <p>Shipping</p>
                  <p>${shippingFee.toFixed(2)}</p>
                </div>
              </div>

              <div className="border-t mt-6 pt-4">
                <div className="flex justify-between text-lg font-semibold text-blue-500">
                  <p>Total</p>
                  <p>${formattedTotal}</p>
                </div>
              </div>

              {/* Shipping Address Card */}
              <div className="pt-4">
                {defaultAddress ? (
                  <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-md">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-sm font-semibold">
                        Shipping Address
                      </h2>
                      <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                        Default
                      </span>
                    </div>

                    <div className="text-xs text-gray-700">
                      <p className="font-bold">
                        {defaultAddress.firstName +
                          ' ' +
                          defaultAddress.lastName}
                      </p>
                      <p>
                        {defaultAddress.addressLine1 +
                          ' ' +
                          defaultAddress.addressLine2}
                      </p>
                      <p>
                        {defaultAddress.city +
                          ' ,' +
                          defaultAddress.state +
                          ' ,' +
                          defaultAddress.country +
                          ' ,' +
                          defaultAddress.zipCode}
                      </p>
                      <p>
                        <span></span> {defaultAddress.phoneNumber}
                      </p>
                    </div>
                    <div>
                      <Link to={'/account'}>
                        <button
                          onClick={handleModalToggle}
                          className="mt-2 text-blue-500 underline decoration-dotted underline-offset-4 text-sm cursor-pointer"
                        >
                          Change Address
                        </button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    <p>No default address found. Please add an address.</p>
                    <Link to={'/account'}>
                      <button
                        onClick={handleModalToggle}
                        className="mt-4 text-blue-500 underline decoration-dotted underline-offset-4 text-sm cursor-pointer"
                      >
                        Change Address
                      </button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <button
                className={`w-full font-medium py-3 mt-5 rounded-lg ${
                  cartSummary.items.length === 0
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer active:scale-95 transition-transform duration-150'
                }`}
                onClick={() => {
                  if (!defaultAddress) {
                    toast.error(
                      'Please add a shipping address before proceeding to checkout.'
                    );
                    return;
                  }

                  const confirmCheckout = window.confirm(
                    'Are you sure you want to proceed to checkout?'
                  );
                  if (confirmCheckout) {
                    // Proceed to checkout
                    alert('Proceeding to checkout...');
                    checkout(); // Proceed to checkout if the user confirms
                  }
                }}
                disabled={cartSummary.items.length === 0}
              >
                Checkout
              </button>

              {/* Continue Shopping */}
              <div className="text-center mt-3">
                <Link to={'/products'}>
                  <button className="text-blue-500 underline decoration-dotted underline-offset-4 text-sm cursor-pointer">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSummary;
