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
const categoryK = (categoryE) => {
  switch (categoryE) {
    case "fashion":
      return "패션";
    case "beauty":
      return "뷰티";
    case "sports":
      return "스포츠";
    case "furniture":
      return "가구/인테리어";
    case "life":
      return "생활";
    case "digital":
      return "디지털";
    case "books":
      return "도서/취미";
    case "other":
      return "기타";
  }
};

export const category = async (req, res) => {
  const { category } = req.params;
  let products = [];
  if (category) {
    const categoryName = categoryK(category);
    products = await Product.find({
      category: {
        $regex: new RegExp(`${categoryName}`, "i"),
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
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).render("404", { pageTitle: "Product not found." });
  }
  if (String(product.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  return res.render("layouts/edit", {
    pageTitle: `UPDATE PRODUCT`,
    product,
  });
};

export const postEdit = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { id } = req.params;
  const { title, description, period, category } = req.body;
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).render("404", { pageTitle: "Product not found." });
  }
  if (String(product.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  console.log(period);
  const tem = await Product.findByIdAndUpdate(id, {
    title,
    description,
    period: period
      ? Product.updatePeriodCalculate(product.period, period)
      : product.period,
    category: category ? category : product.category,
  });
  console.log(tem);
  return res.redirect(`/products/${id}`);
};

//Delete
export const getDelete = (req, res) => {
  return res.render("layouts/delete", {
    pageTitle: "DELETE PRODUCT",
    btnName: "Delete",
  });
};

export const postDelete = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    params: { id },
  } = req;
  const product = await Product.findById(id);
  if (String(product.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  //Product DB Delete
  await Product.findByIdAndDelete(id);
  //User DB Delete
  const user = await User.findById(_id);
  user.products.splice(user.products.indexOf(id), 1);
  await user.save();
  return res.redirect("/");
};
