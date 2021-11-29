import Product from "../models/Product";
import User from "../models/User";

//Home
export const home = async (req, res) => {
  const products = await Product.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("layouts/home", { pageTitle: "HOME", products });
};

//Category
export const category = async (req, res) => {
  const { category } = req.params;
  let products = [];
  if (category) {
    products = await Product.find({
      category: {
        $regex: new RegExp(`${category}`, "i"),
      },
    }).populate("owner");
  }
  return res.render("layouts/home", {
    pageTitle: "CATEGORY",
    products,
  });
};

//Detail
export const detail = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("owner");
  if (!product) {
    return res.render("404", { pageTitle: "Product not found" });
  }
  return res.render("layouts/detail", { pageTitle: product.title, product });
};

//Upload
export const getUpload = (req, res) => {
  return res.render("layouts/upload", { pageTitle: "UPLOAD PRODUCT" });
};

export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    files,
  } = req;
  const { title, description, startPrice, period, category } = req.body;
  try {
    const newProduct = await Product.create({
      title,
      description,
      fileUrl: Product.photoArrayPath(files),
      startPrice,
      currentPrice: startPrice,
      period: Product.periodCalculate(period),
      category,
      owner: _id,
    });
    const user = await User.findById(_id);
    user.products.push(newProduct._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("layouts/upload", {
      pageTitle: "UPLOAD PRODUCT",
      errorMessage: error._message,
    });
  }
};

//Edit
export const getEdit = (req, res) => {};

export const postEdit = (req, res) => {};

//Delete
export const getDelete = (req, res) => {
  return res.render("layouts/delete", { pageTitle: "DELETE PRODUCT" });
};

export const postDelete = (req, res) => {};
