const User = require('../Models/users');

const makeDefaultAddress = async (req, res) => {
  const { index } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate index
    if (index < 0 || index >= user.address.length) {
      return res.status(400).json({ error: 'Invalid address index' });
    }

    // Set all addresses to not default
    user.address.forEach((addr) => {
      addr.isDefaultShippingAddress = false;
    });

    // Set selected address as default
    user.address[index].isDefaultShippingAddress = true;
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error making default address:', error);
    return res.status(500).json({ error: 'Failed to make address default' });
  }
};

const deleteAddress = async (req, res) => {
  const { index } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (index < 0 || index >= user.address.length) {
      return res.status(400).json({ error: 'Invalid address index' });
    }

    const wasDefault = user.address[index].isDefaultShippingAddress;
    user.address.splice(index, 1);

    // If we deleted the default address and there are other addresses
    if (wasDefault && user.address.length > 0) {
      // Set the first address as the new default
      user.address[0].isDefaultShippingAddress = true;
    }

    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error deleting address:', error);
    return res.status(500).json({ error: 'Failed to delete address' });
  }
};

const addAddress = async (req, res) => {
  const { address } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If this is the first address, set it as default
    if (user.address.length === 0) {
      address.isDefaultShippingAddress = true;
    }

    user.address.push(address);
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error adding address:', error);
    return res.status(500).json({ error: 'Failed to add address' });
  }
};
module.exports = {
  deleteAddress,
  makeDefaultAddress,
  addAddress,
};
