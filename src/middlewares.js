import multer from "multer";
import User from "./models/User";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import Product from "./models/Product";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const isHeroku = process.env.NODE_ENV === "production";

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "ggauction/images",
  acl: "public-read",
});

const s3ProductsUploader = multerS3({
  s3: s3,
  bucket: "ggauction/products",
  acl: "public-read",
});

export const s3DeleteAvatarMiddleware = (req, res, next) => {
  if (!req.file) {
    return next();
  }
  console.log(req.session.user.avatarUrl.split("/")[4]);
  s3.deleteObject(
    {
      Bucket: `ggauction`,
      Key: `images/${req.session.user.avatarUrl.split("/")[4]}`,
    },
    (err, data) => {
      if (err) {
        throw err;
      }
      console.log(`s3 deleteObject`, data);
    }
  );
  next();
};

export const s3DeleteProductsMiddleware = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  const deleteList = [];
  for (let url of product.fileUrl) {
    deleteList.push({ Key: `products/${url.split("/")[4]}` });
  }
  s3.deleteObjects(
    {
      Bucket: "ggauction",
      Delete: {
        Objects: deleteList,
        Quiet: false,
      },
    },
    (err, data) => {
      if (err) {
        throw err;
      }
      console.log(`s3 deleteObject`, data);
    }
  );
  next();
};

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  res.locals.isHeroku = isHeroku;
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Log in first.");
    return res.redirect("/");
  }
};

export const userEmailAddressCheck = async (req, res, next) => {
  const {
    user: { _id },
  } = req.session;
  const user = await User.findById(_id);
  if (user.email === "" || user.address === "") {
    req.flash("error", "Please fill in all information.");
    return res.redirect("/users/edit");
  }
  return next();
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
  storage: isHeroku ? s3ImageUploader : undefined,
});

export const productUpload = multer({
  dest: "uploads/products/",
  limits: {
    fileSize: 10000000,
  },
  storage: isHeroku ? s3ProductsUploader : undefined,
});
