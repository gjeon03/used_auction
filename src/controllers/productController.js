import fakeDb from "../models/Product";

//Home
export const home = (req, res) => {
  return res.render("layouts/home", { pageTitle: "HOME", products: fakeDb });
};

//Category
export const category = (req, res) => {
  return res.render("layouts/home", {
    pageTitle: "CATEGORY",
    products: fakeDb,
  });
};

//Detail
export const detail = (req, res) => {
  return res.render("layouts/detail", { pageTitle: "detail" });
};

//Upload
export const getUpload = (req, res) => {
  return res.render("layouts/upload", { pageTitle: "UPLOAD PRODUCT" });
};

export const postUpload = (req, res) => {};

//Edit
export const getEdit = (req, res) => {};

export const postEdit = (req, res) => {};

//Delete
export const getDelete = (req, res) => {};

export const postDelete = (req, res) => {};
