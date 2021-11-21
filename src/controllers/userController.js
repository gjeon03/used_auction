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
export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { address, address2 },
    file,
  } = req;
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.location : avatarUrl,
      address,
      address2,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};

//Logout
export const logout = (req, res) => {
  req.session.user = null;
  res.locals.loggedInUser = req.session.user;
  req.session.loggedIn = false;
  //req.flash("info", "Bye Bye");
  return res.redirect("/");
};

//Change Password
export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "Can't change password.");
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "현재 비밀번호가 올바르지 않습니다.",
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "비밀번호가 확인과 일치하지 않습니다.",
    });
  }
  if (oldPassword === newPassword) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "현재 비밀번호와 동일합니다.",
    });
  }
  user.password = newPassword;
  await user.save();
  return res.redirect("/users/logout");
};

//Delete
export const getDelete = (req, res) => {
  return res.render("delete", { pageTitle: "Sign out" });
};

export const postDelete = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { password },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("delete", {
      pageTitle: "Sign out",
      errorMessage: "비밀번호가 올바르지 않습니다.",
    });
  }
  await User.findByIdAndDelete(_id);
  req.session.user = null;
  res.locals.loggedInUser = req.session.user;
  req.session.loggedIn = false;
  return res.redirect("/");
};

//Bid list
export const getBidList = (req, res) => {};

//Profile
export const profile = (req, res) => {};
