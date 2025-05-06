const User = require('../Models/users');

const deleteOrder = async (req, res) => {
  const { index } = req.body.index;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (index < 0 || index >= user.orders.length) {
      return res.status(400).json({ message: 'Invalid order index' });
    }

    // Remove the order at the specified index
    user.orders.splice(index, 1);
    await user.save();
    return res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Failed to delete order' });
  }
};

module.exports = { deleteOrder };
