import Product from "../models/Product";
import User from "../models/User";
import Comment from "../models/Comment";

//Products result
const productsResult = (products) => {
  let tmp = [];
  let tmpEnd = [];
  const nowTime = new Date().getTime();
  for (let product of products) {
    const dataTime = new Date(product.period).getTime();
    if (dataTime - nowTime > 0) {
      tmp.push(product);
    } else {
      tmpEnd.push(product);
    }
  }
  const result = tmp.concat(tmpEnd);
  return result;
};

//Sort
const sortBy = (sort) => {
  switch (sort) {
    case "period":
      return { period: "asc" };
    case "price":
      return { currentPrice: "asc" };
    case "bid":
      return { "meta.bidsCount": "desc" };
    default:
      return { createdAt: "desc" };
  }
};

//Home
export const home = async (req, res) => {
  const { keyword, sort } = req.query;
  let products = [];
  if (keyword) {
    products = await Product.find({
      title: {
        $regex: new RegExp(`${keyword}`, "i"),
      },
    })
      .sort(sortBy(sort))
      .populate("owner");
  } else {
    products = await Product.find({}).sort(sortBy(sort)).populate("owner");
  }
  const results = productsResult(products);
  return res.render("home", {
    pageTitle: "HOME",
    products: results,
    keyword,
    sort,
  });
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
  const { sort, keyword } = req.query;
  let products = [];
  if (category) {
    if (keyword) {
      const categoryName = categoryK(category);
      products = await Product.find({
        category: {
          $regex: new RegExp(`${categoryName}`, "i"),
        },
        title: {
          $regex: new RegExp(`${keyword}`, "i"),
        },
      })
        .sort(sortBy(sort))
        .populate("owner");
      return res.render("home", {
        pageTitle: "SEARCH",
        products,
        sort,
        keyword,
      });
    }
    const categoryName = categoryK(category);
    products = await Product.find({
      category: {
        $regex: new RegExp(`${categoryName}`, "i"),
      },
    })
      .sort(sortBy(sort))
      .populate("owner");
  }
  return res.render("home", {
    pageTitle: "CATEGORY",
    products,
    sort,
    keyword,
  });
};

//Detail
export const detail = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate("owner")
    .populate("comments")
    .populate("buyer");
  if (!product) {
    return res.render("404", { pageTitle: "Product not found" });
  }
  return res.render("products/detail", {
    pageTitle: "DETAIL",
    product,
  });
};

//Upload
export const getUpload = (req, res) => {
  return res.render("products/upload", { pageTitle: "UPLOAD PRODUCT" });
};

export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    files,
  } = req;
  const { title, description, startPrice, period, category } = req.body;
  const isHeroku = process.env.NODE_ENV === "production";
  try {
    const newProduct = await Product.create({
      title,
      description,
      fileUrl: Product.photoArrayPath(files, isHeroku),
      startPrice,
      currentPrice: startPrice,
      period: Product.periodCalculate(period),
      category,
      owner: _id,
    });
    const user = await User.findById(_id);
    user.products.push(newProduct._id);
    user.save();
    req.flash("success", "Product upload complete.");
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("products/upload", {
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
  return res.render("products/edit", {
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
    req.flash("error", "You are not the the owner of the product.");
    return res.status(403).redirect("/");
  }
  await Product.findByIdAndUpdate(id, {
    title,
    description,
    period: period
      ? Product.updatePeriodCalculate(product.period, period)
      : product.period,
    endCheck: Product.updatePeriodEndCheck(product.period, period),
    category: category ? category : product.category,
  });
  req.flash("success", "Changes saved.");
  return res.redirect(`/products/${id}`);
};

//Delete
export const getDelete = (req, res) => {
  return res.render("delete", {
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
    req.flash("error", "You are not the the owner of the product.");
    return res.status(403).redirect("/");
  }
  //Product DB Delete
  await Product.findByIdAndDelete(id);
  //User DB Delete
  const user = await User.findById(_id);
  user.products.splice(user.products.indexOf(id), 1);
  await user.save();
  req.flash("success", "Product deletion complete.");
  return res.redirect("/");
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const product = await Product.findById(id);
  if (!product) {
    return res.sendStatus(404);
  }
  const commentUser = await User.findById(user._id);
  if (!commentUser) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    ownerUserName: user.username,
    product: id,
  });
  commentUser.comments.push(comment._id);
  product.comments.push(comment._id);
  product.save();
  commentUser.save();
  return res
    .status(201)
    .json({ newCommentId: comment._id, username: user.username });
};

export const deleteComment = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
    body: { productId },
  } = req;
  //comment DB delete
  const comment = await Comment.findById(id);
  if (!comment) {
    return res.sendStatus(404);
  }
  if (String(comment.owner) !== String(_id)) {
    req.flash("error", "You are not the the owner of the comment.");
    return res.status(403).redirect("/");
  }
  await Comment.findByIdAndDelete(id);
  //product DB comment delete
  const product = await Product.findById(productId);
  product.comments.splice(product.comments.indexOf(id), 1);
  await product.save();
  //user DB comment delete
  const commentUser = await User.findById(_id);
  commentUser.comments.splice(commentUser.comments.indexOf(id), 1);
  await commentUser.save();
  return res.sendStatus(200);
};

//Product to bid
export const postToBid = async (req, res) => {
  const {
    session: { user },
    body: { price },
    params: { id },
  } = req;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ errorMessage: "Incorrect product information." });
    }
    if (product.endCheck) {
      return res.status(404).json({ errorMessage: "End of auction." });
    }
    if (product.currentPrice >= Number(price)) {
      return res
        .status(404)
        .json({ errorMessage: "Please write a higher bid amount." });
    }
    const userDb = await User.findById(user._id).populate("bid");
    if (!userDb) {
      return res
        .status(404)
        .json({ errorMessage: "User information is incorrect." });
    }
    product.currentPrice = Number(price);
    product.buyer = userDb._id;
    product.meta.bidsCount = product.meta.bidsCount + 1;

    //User email & address check
    if (userDb.email === "" || userDb.address === "") {
      req.flash("error", "Please fill in all information.");
      return res.status(404).json({ errorMessage: "information" });
    }
    // User buyer change
    const changeBuyers = await User.find({
      bid: product._id,
    });
    for (let changeUser of changeBuyers) {
      changeUser.bid.splice(changeUser.bid.indexOf(id), 1);
      changeUser.save();
    }

    // User Auction List Duplicate Check
    let flag = false;
    if (userDb.bid.length > 0) {
      for (let i = 0; i < userDb.bid.length; i++) {
        if (String(userDb.bid[i]._id) === String(product._id)) {
          userDb.bid[i] = product._id;
          flag = false;
        } else {
          flag = true;
        }
      }
      if (flag) {
        userDb.bid.push(product._id);
        userDb.save();
      }
    } else {
      userDb.bid.push(product._id);
      userDb.save();
    }
    product.save();
    return res.status(201).json({ buyer: userDb.username });
  } catch (e) {
    console.log(e);
  }
};
