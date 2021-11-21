import User from "../models/User";
import bcrypt from "bcrypt";

//Join
export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { email, username, password, password2, address, address2 } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "비밀번호를 확인해주세요.",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "이 이메일은 이미 사용중입니다.",
    });
  }
  try {
    await User.create({
      username,
      email,
      password,
      address,
      address2,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: pageTitle,
      errorMessage: error._message,
    });
  }
};

//Login
export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ email, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "이 이메일을 사용하는 계정이 존재하지 않습니다.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "잘못된 비밀번호입니다.",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

//Edit
export const getEdit = (req, res) => {};

export const postEdit = (req, res) => {};

//Logout
export const logout = (req, res) => {
  req.session.user = null;
  res.locals.loggedInUser = req.session.user;
  req.session.loggedIn = false;
  //req.flash("info", "Bye Bye");
  return res.redirect("/");
};

//Change Password
export const getChangePassword = (req, res) => {};

export const postChangePassword = (req, res) => {};

//Shopping Basket
export const getShoppingBasket = (req, res) => {};

export const postShoppingBasket = (req, res) => {};

//Delete
export const getDelete = (req, res) => {};

export const postDelete = (req, res) => {};

//Bid list
export const getBidList = (req, res) => {};

//Profile
export const profile = (req, res) => {};
