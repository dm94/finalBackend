const controller = {};
const Product = require("../models/product");
const Category = require("../models/category");
const productValidator = require("../validators/product");

controller.getProducts = async (req, res) => {
  try {
    let filter = {};
    let sort = {};

    let sortType =
      req.query.orderby == "price" ? req.query.orderby : "publishedDate";
    let sortOrder = req.query.sort == "asc" ? req.query.sort : "desc";

    sort[sortType] = sortOrder;

    if (req.query.type) {
      filter.type = req.query.type;
    }

    if (req.query.categoryId) {
      filter.category = req.query.categoryId;
    }
    if (req.query.title) {
      filter.title = new RegExp("^" + req.query.title + "$", "i");
    }
    if (req.query.size) {
      filter.size = req.query.size;
    }

    let perPage = 10;
    let page = req.query.page > 0 ? req.query.page : 0;

    let products = await Product.find(filter)
      .sort(sort)
      .limit(perPage)
      .skip(perPage * page);

    if (products != null) {
      res.json(products);
    } else {
      res.status(404).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

controller.addProduct = async (req, res) => {
  try {
    let validation = productValidator.validate(req.body);
    if (validation == null || validation.error) {
      return res.status(400).send(validation.error.details[0].message);
    } else {
      const publisher = req.user;

      let filter = {
        type: req.body.type,
        category: req.body.category ? req.body.category : undefined,
        subcategory: req.body.subcategory ? req.body.subcategory : undefined,
      };

      const category = await Category.findOne(filter);

      let newProduct = new Product({
        publisherId: publisher,
        image: req.body.image,
        title: req.body.title,
        size: req.body.size,
        price: req.body.price,
        description: req.body.description,
        type: req.body.type,
        category: category ? category : undefined,
      });

      await newProduct.save();
      const data = await Product.findOne({
        title: req.body.title,
        publisherId: publisher,
      });
      res.status(201).send(data);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

controller.getProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).send({ error: "Missing data" });
    }
    try {
      const product = await Product.findById(productId);
      if (!product) {
        res.status(404).send({ error: "Product not found" });
      } else {
        res.status(200).send(product);
      }
    } catch (err) {
      console.log(err);
      res.status(404).send({ error: "Product not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

controller.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).send({ error: "Missing data" });
    }
    let product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    } else {
      let publisherid = String(product.publisherId);
      let userid = String(req.user._id);
      if (userid != publisherid) {
        return res.status(403).send();
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
        product.description = req.body.description;
        product.type = req.body.type;
        product.category = category;
        product.images = req.body.images;
        product.sold = req.body.sold;

        await product.save();

        const data = await Product.findOne({
          title: req.body.title,
          publisherId: product.publisherId,
        });
        res.status(202).send(data);
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

controller.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).send({ error: "Missing data" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).send({ error: "Product not found" });
    } else {
      const user = req.user;
      if (product.publisherId.equals(user._id)) {
        try {
          await Product.findByIdAndDelete(product);
          res.status(204).send();
        } catch (err) {
          console.log(err);
          res.status(500).send({ error: "Product could not be deleted" });
        }
      } else {
        res.status(403).send();
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

module.exports = controller;
