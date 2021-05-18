const controller = {};
const Category = require("../models/category");
require("dotenv").config();

controller.getCategories = async (req, res) => {
  try {
    const type = req.query.type;
    let query = {};
    if (type != null) {
      query.type = type;
    }

    const categories = await Category.find(query);
    res.json(categories);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

controller.addCategory = async (req, res) => {
  try {
    if (req.query.apiKey == process.env.API_KEY) {
      const type = req.body.type;
      const category = req.body.category;
      const subcategory = req.body.subcategory;

      if (type == "plant" || type == "insect") {
        const data = await Category.findOne({
          type: type,
          category: category,
          subcategory: subcategory,
        });

        if (!data) {
          const term = new Category({
            type: type,
            category: category,
            subcategory: subcategory,
          });
          await term.save();
          res.status(201).send();
        } else {
          res.status(409).send({ error: "This category already exists" });
        }
      } else {
        res.status(400).send();
      }
    } else {
      res.status(401).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

controller.deleteCategory = async (req, res) => {
  try {
    if (req.query.apiKey == process.env.API_KEY) {
      try {
        await Category.findByIdAndDelete(req.params.categoryId);
        res.status(204).send();
      } catch (err) {
        console.log(err);
        res.status(500).send("Category could not be deleted");
      }
    } else {
      res.status(401).send();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

module.exports = controller;
