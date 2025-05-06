import { useContext, useEffect, useState } from 'react';
import { Context } from '../Context';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function AccountPageOrders() {
  const { user, fetchUser } = useContext(Context);
  const [expandedOrders, setExpandedOrders] = useState({});

  const handleDeleteOrder = async (orderIndex) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const response = await axios.delete(
          '/.netlify/functions/deleteOrderFromHistory',
          {
            data: { index: orderIndex },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          await fetchUser(); // Refresh user after deletion
          toast.success('Order deleted successfully!');
        } else {
          toast.error('Failed to delete order.');
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error('Failed to delete order.');
      }
    }
  };

  const toggleOrderExpansion = (orderIndex) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderIndex]: !prev[orderIndex],
    }));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Order History
      </h2>

      <div className="mt-6 space-y-10 flex flex-col items-center">
        {user.orders && user.orders.length > 0 ? (
          user.orders
            .slice()
            .reverse()
            .map((order, orderIndex) => (
              <div
                key={order._id || orderIndex}
                className="border p-4 rounded-lg shadow-sm w-80 lg:w-100"
              >
                <div className="mb-10 text-sm text-gray-500">
                  Order Date: {new Date(order.date).toLocaleDateString()}
                </div>

                <div className="space-y-4">
                  {expandedOrders[orderIndex] ? (
                    order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-4">
                        <img
                          src={item.image || '/placeholder.jpg'}
                          alt={item.title || 'Product'}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-600">
                            Price: ${Number(item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : order.items.length > 0 ? (
                    <div className="flex items-center gap-4">
                      <img
                        src={order.items[0].image || '/placeholder.jpg'}
                        alt={order.items[0].title || 'Product'}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-semibold">{order.items[0].title}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {order.items[0].quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Price: ${Number(order.items[0].price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No items in this order.
                    </p>
                  )}

                  {order.items.length > 1 && (
                    <button
                      aria-expanded={expandedOrders[orderIndex]}
                      onClick={() => toggleOrderExpansion(orderIndex)}
                      className="mt-4 text-blue-500 hover:underline"
                    >
                      {expandedOrders[orderIndex] ? 'View Less' : 'View More'}
                    </button>
                  )}

                  <div className="mt-4 border-t pt-3 text-sm">
                    <div className="flex justify-between pb-1 mt-2">
                      <span>Subtotal:</span>
                      <span>
                        $
                        {(
                          order.totalAmount -
                          order.shipping -
                          order.tax
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span>Tax:</span>
                      <span>$ {order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span>Shipping:</span>
                      <span>$ {order.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        Total Amount for {order.items.length} item
                        {order.items.length > 1 ? 's' : ''}:
                      </span>
                      <span>$ {order.totalAmount.toFixed(2)}</span>
                    </div>

                    <div>
                      <button
                        onClick={() => handleDeleteOrder(orderIndex)}
                        className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 text-sm mt-3"
                      >
                        Delete Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <p>No orders found</p>
        )}
      </div>
    </div>
  );
}

export default AccountPageOrders;
