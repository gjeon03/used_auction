import multer from "multer";
import User from "./models/User";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
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
});

export const productUpload = multer({
  dest: "uploads/products/",
  limits: {
    fileSize: 10000000,
  },
});
