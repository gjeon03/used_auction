import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import Product from "../models/Product";

//Join
export const getJoin = (req, res) => {
  return res.render("users/join", { pageTitle: "JOIN" });
};

export const postJoin = async (req, res) => {
  const { email, name, username, password, password2, address, address2 } =
    req.body;
  const pageTitle = "JOIN";
  if (password !== password2) {
    return res.status(400).render("users/join", {
      pageTitle,
      errorMessage: "비밀번호를 확인해주세요.",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("users/join", {
      pageTitle,
      errorMessage: "이 이메일은 이미 사용중입니다.",
    });
  }
  try {
    await User.create({
      username,
      name,
      email,
      password,
      address,
      address2,
    });
    req.flash("success", "Sign up completed.");
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("users/join", {
      pageTitle: pageTitle,
      errorMessage: error._message,
    });
  }
};

//Login
export const getLogin = (req, res) => {
  return res.render("users/login", { pageTitle: "LOGIN" });
};

export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const pageTitle = "LOGIN";
  const user = await User.findOne({ email, socialOnly: false });
  if (!user) {
    return res.status(400).render("users/login", {
      pageTitle,
      errorMessage: "이 이메일을 사용하는 계정이 존재하지 않습니다.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("users/login", {
      pageTitle,
      errorMessage: "잘못된 비밀번호입니다.",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  req.flash("success", "Welcome.");
  return res.redirect("/");
};

//Edit
export const getEdit = (req, res) => {
  return res.render("users/edit-profile", { pageTitle: "EDIT PROFILE" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { address, address2 },
    file,
  } = req;
  const isHeroku = process.env.NODE_ENV === "production";
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? (isHeroku ? file.location : file.path) : avatarUrl,
      address,
      address2,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  req.flash("success", "Profile edit complete.");
  return res.redirect("/users/edit");
};

//Logout
export const logout = (req, res) => {
  req.session.user = null;
  res.locals.loggedInUser = req.session.user;
  req.session.loggedIn = false;
  req.flash("info", "Bye Bye");
  return res.redirect("/");
};

//Change Password
export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    req.flash("error", "Can't change password.");
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "CHANGE PASSWORD" });
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
  const pageTitle = "CHANGE PASSWORD";
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: pageTitle,
      errorMessage: "현재 비밀번호가 올바르지 않습니다.",
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: pageTitle,
      errorMessage: "비밀번호가 확인과 일치하지 않습니다.",
    });
  }
  if (oldPassword === newPassword) {
    return res.status(400).render("users/change-password", {
      pageTitle: pageTitle,
      errorMessage: "현재 비밀번호와 동일합니다.",
    });
  }
  user.password = newPassword;
  await user.save();
  req.flash("success", "Password change complete.");
  return res.redirect("/users/logout");
};

//Delete
export const getDelete = (req, res) => {
  return res.render("delete", {
    pageTitle: "SIGN OUT",
    btnName: "Sign out",
  });
};

export const postDelete = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { password },
  } = req;
  const user = await User.findById(_id).populate("products");
  if (!user.social.socialOnly) {
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).render("delete", {
        pageTitle: "SIGN OUT",
        errorMessage: "비밀번호가 올바르지 않습니다.",
      });
    }
  } else {
    //social sign out
    switch (user.social.socialName) {
      case "github":
        break;
      case "kakao":
        // const target_id = Number(user.username);
        // const tmp = await fetch("https://kapi.kakao.com/v1/user/unlink", {
        //   method: "POST",
        //   headers: {
        //     "content-type": "application/x-www-form-urlencoded",
        //     Authorization: `KakaoAK ${process.env.KAKAO_ADMIN}`,
        //   },
        //   target_id_type: "user_id",
        //   target_id,
        // });
        // console.log(tmp);
        break;
    }
  }
  //Product DB Delete
  for (const item of user.products) {
    //const product = await Product.findById(item._id);
    await Product.findByIdAndDelete(item._id);
  }
  //User DB Delete
  await User.findByIdAndDelete(_id);
  req.session.user = null;
  res.locals.loggedInUser = req.session.user;
  req.session.loggedIn = false;
  req.flash("success", "Sign out completed.");
  return res.redirect("/");
};

//Bid list
export const getBidList = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
  } = req;
  const user = await User.findById(_id).populate("bid");
  return res.render("users/bid-list", {
    pageTitle: "BID LIST",
    products: user.bid,
  });
};

//Profile
export const profile = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const user = await User.findById(id).populate({
    path: "products",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found." });
  } else if (String(id) !== String(_id)) {
    return res.status(404).render("404", { pageTitle: "Wrong approach." });
  }
  return res.render("users/profile", {
    pageTitle: "PROFILE",
    user,
  });
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  // const { access_token } = tokenRequest;
  // const clientId = process.env.GH_ASSESS_TOKEN;
  // const octokit = new Octokit({ auth: clientId });
  // await octokit.request(`DELETE /applications/${clientId}/grant`, {
  //   client_id: "client_id",
  //   access_token: "access_token",
  // });
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name ? userData.name : userData.login,
        username: userData.login,
        email: emailObj.email,
        password: "",
        address: "",
        address2: "",
        social: { socialOnly: true, socialName: "github" },
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    req.flash("success", "Welcome.");
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
  //return res.redirect("/");
};

export const startKakaoLogin = (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KAKAO_KEY,
    redirect_uri: "https://used-auction.herokuapp.com/users/kakao/finish",
    response_type: "code",
    scope: "profile_image profile_nickname account_email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishKakaoLogin = async (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/token";
  const config = {
    client_id: process.env.KAKAO_KEY,
    client_secret: process.env.KAKAO_SECRET,
    code: req.query.code,
    grant_type: "authorization_code",
    redirect_uri: "https://used-auction.herokuapp.com/users/kakao/finish",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://kapi.kakao.com";
    const userData = await (
      await fetch(`${apiUrl}/v2/user/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    const {
      id,
      properties: { nickname, profile_image },
      kakao_account: { email },
    } = userData;
    if (!email) {
      await fetch("https://kapi.kakao.com/v1/user/unlink", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return res.render("layouts/login", {
        pageTitle: "LOGIN",
        errorMessage: "이메일 정보 제공에 동의해주세요.",
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        avatarUrl: profile_image,
        name: nickname,
        username: id,
        email,
        password: "",
        address: "",
        address2: "",
        social: { socialOnly: true, socialName: "kakao" },
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    req.flash("success", "Welcome.");
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const deleteKakao = (req, res) => {};
