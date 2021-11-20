//Login
export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};

export const postLogin = (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  return res.redirect("/");
};

//Join
export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = (req, res) => {
  return res.redirect("/login");
};

//Edit
export const getEdit = (req, res) => {};

export const postEdit = (req, res) => {};

//Logout
export const logout = (req, res) => {};

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
