const controller = {};
const Product = require("../models/product");
const Category = require("../models/category");
const productValidator = require("../validators/product");

controller.getProducts = async (req, res) => {
  res.status(501).send();
};

controller.addProduct = async (req, res) => {
  let validation = productValidator.validate(req.body);
  if (validation == null || validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  } else {
    const publisher = req.user;

    let filter = {
      type: req.body.type,
      category: req.body.category,
      subcategory: req.body.subcategory,
    };

    const category = await Category.findOne(filter);

    let newProduct = new Product({
      publisherId: publisher,
      image: req.body.image,
      title: req.body.title,
      size: req.body.size,
      price: req.body.price,
      climate: req.body.climate,
      description: req.body.description,
      type: req.body.type,
      category: category,
    });

    await newProduct.save();
    const data = await Product.findOne({
      title: req.body.title,
      publisherId: publisher,
    });
    res.status(201).send(data);
  }
};

controller.getProduct = async (req, res) => {
  const productId = req.params.id;
  if (!productId) {
    return res.status(400).send("Missing data");
  }
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    res.status(404).send("Product not found");
  } else {
    res.status(200).send(product);
  }
};

controller.updateProduct = async (req, res) => {
  const productId = req.params.id;
  if (!productId) {
    return res.status(400).send("Missing data");
  }
  let product = await Product.findOne({ _id: productId });
  if (!product) {
    return res.status(404).send("Product not found");
  } else {
    let publisherid = String(product.publisherId);
    let userid = String(req.user._id);
    if (userid != publisherid) {
      return res.status(401).send();
    }
    let validation = productValidator.validate(req.body);
    if (validation == null || validation.error) {
      return res.status(400).send(validation.error.details[0].message);
    } else {
      let filter = {
        type: req.body.type,
        category: req.body.category,
        subcategory: req.body.subcategory,
      };
      const category = await Category.findOne(filter);

      product.title = req.body.title;
      product.size = req.body.size;
      product.price = req.body.price;
      product.climate = req.body.climate;
      product.description = req.body.description;
      product.type = req.body.type;
      product.category = category;

      await product.save();

      const data = await Product.findOne({
        title: req.body.title,
        publisherId: product.publisherId,
      });
      res.status(201).send(data);
    }
  }
  res.status(501).send();
};

controller.deleteProduct = async (req, res) => {
  const productId = req.params.id;
  if (!productId) {
    return res.status(400).send("Missing data");
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
