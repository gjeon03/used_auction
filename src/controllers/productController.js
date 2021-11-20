//Home
export const home = (req, res) => {
  return res.render("home", { pageTitle: "Home" });
};

//Detail
export const detail = (req, res) => {
  return res.render("detail", { pageTitle: "detail" });
};

//Upload
export const getUpload = (req, res) => {};

export const postUpload = (req, res) => {};

//Edit
export const getEdit = (req, res) => {};

export const postEdit = (req, res) => {};

//Delete
export const getDelete = (req, res) => {};

export const postDelete = (req, res) => {};
