const User = require('../Models/users');

const calculateCartTotals = (cart) => {
  const subTotal = parseFloat(
    cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)
  );
  const tax = parseFloat((subTotal * 0.1).toFixed(2));
  const shipping = cart.length > 0 ? 10 : 0;
  const totalAmount = parseFloat((subTotal + tax + shipping).toFixed(2));

  return { subTotal, tax, shipping, totalAmount };
};

////////////////////////////////////////////////////////////////////
// Fetch the user's cart
////////////////////////////////////////////////////////////////////

const getCart = async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { subTotal, tax, shipping, totalAmount } = calculateCartTotals(
      user.cart
    );

    // Return the cart items
    res.status(200).json({
      cartSummary: {
        items: user.cart,
        subTotal,
        tax,
        shipping,
        totalAmount,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

////////////////////////////////////////////////////////////////////
// Add an item to the cart
////////////////////////////////////////////////////////////////////

const addToCart = async (req, res) => {
  const { productId, title, price, quantity, image } = req.body;
  try {
    // Check if user exists
    const user = await User.findById(req.user.id);
    console.log('User ID:', req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let message = 'Item added to cart';

    // Check if item already exists in the cart, if it does, update the quantity
    const addCartExistingItemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );
    if (addCartExistingItemIndex !== -1) {
      user.cart[addCartExistingItemIndex].quantity += quantity; // update quantity by using the found index
      user.cart[addCartExistingItemIndex].price =
        price * user.cart[addCartExistingItemIndex].quantity; // update the price by using the found index * quantity
      message = 'Item quantity updated in cart';
    } else {
      // if not, add to card
      user.cart.push({
        productId,
        title,
        price: price * quantity,
        quantity,
        image,
      });
    }

    // Save the updated user
    await user.save();

    // Calculate totals
    const { subTotal, tax, shipping, totalAmount } = calculateCartTotals(
      user.cart
    );

    res.status(200).json({
      message,
      cartSummary: {
        items: user.cart,
        subTotal,
        tax,
        shipping,
        totalAmount,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

////////////////////////////////////////////////////////////////////
// Remove a single item on the cart
////////////////////////////////////////////////////////////////////

const removeFromCart = async (req, res) => {
  const { productId } = req.body;

  try {
    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // check if the product exists on the cart
    const removeCartExistingItemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );
    if (removeCartExistingItemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Remove the item from the cart. Parameters are, index of item, then number of items to remove
    user.cart.splice(removeCartExistingItemIndex, 1);

    // Save the updated user
    await user.save();

    // Return the updated cart
    const { subTotal, tax, shipping, totalAmount } = calculateCartTotals(
      user.cart
    );

    res.status(200).json({
      message: 'Item removed from cart',
      cart: user.cart,
      subTotal,
      tax,
      shipping,
      totalAmount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

////////////////////////////////////////////////////////////////////
// Update quantity
////////////////////////////////////////////////////////////////////

const updateCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the item on the cart
    const updateCartExistingItemIndex = user.cart.findIndex(
      (item) => item.productId === productId
    );
    if (updateCartExistingItemIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Ensure that quantity is at least 1
    const newQuantity = Math.max(quantity, 1); // the parameters will be compared, return whichever is greater

    //Price
    const currentItem = user.cart[updateCartExistingItemIndex];
    const unitPrice = currentItem.price / currentItem.quantity;

    //Update Quantity
    currentItem.quantity = newQuantity;
    currentItem.price = unitPrice * newQuantity;

    // Save the updated cart
    await user.save();

    // Return the updated cart
    const { subTotal, tax, shipping, totalAmount } = calculateCartTotals(
      user.cart
    );

    res.status(200).json({
      message: 'Cart updated successfully',
      cart: user.cart,
      subTotal,
      tax,
      shipping,
      totalAmount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

////////////////////////////////////////////////////////////////////
// Clear the whole cart
////////////////////////////////////////////////////////////////////

const clearCart = async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clear the cart
    user.cart = [];

    // Save the updated user
    await user.save();

    // Return the updated cart
    res.status(200).json({
      message: 'Cart cleared successfully',
      cart: [],
      subTotal: 0,
      tax: 0,
      shipping: 0,
      totalAmount: 0,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const storeOrder = async (req, res) => {
  const { items, totalAmount, tax, shipping } = req.body;

  try {
    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the order to the user's order array
    user.orders.push({
      items,
      totalAmount,
      tax,
      shipping,
    });

    await user.save();

    res
      .status(200)
      .json({ message: 'Order stored successfully', orders: user.orders });
  } catch (error) {
    console.error('Error storing order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCart,
  clearCart,
  storeOrder,
};
