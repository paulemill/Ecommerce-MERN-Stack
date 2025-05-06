const Product = require('../Models/products');

const getProductByID = async (req, res) => {
  try {
    const { id } = req.params; // Extract the custom ID from the route parameter
    const products = await Product.findOne({ id: id }); // match the schema
    if (!products) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProductByID };
