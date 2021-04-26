const controller = {};
const Product = require("../models/product");

controller.getProducts = async (req, res) => {
  res.status(501).send();
};

controller.addProduct = async (req, res) => {
  res.status(501).send();
};

controller.getProduct = async (req, res) => {
  const productId = req.params.id;
  if (!productId) {
    res.status(400).send("Missing data");
  }
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    res.status(404).send("Product not found");
  } else {
    res.status(200).send(product);
  }
};

controller.updateProduct = async (req, res) => {
  res.status(501).send();
};

controller.deleteProduct = async (req, res) => {
  const productId = req.params.id;
  if (!productId) {
    res.status(400).send("Missing data");
  }
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    res.status(404).send("Product not found");
  } else {
    const user = req.user;
    if (product.publisherId == user._id) {
      try {
        await Product.findByIdAndDelete(product);
        res.status(204).send();
      } catch (err) {
        console.log(err);
        res.status(500).send("Product could not be deleted");
      }
    } else {
      res.status(401).send();
    }
  }
};

module.exports = controller;
