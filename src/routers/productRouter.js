import express from "express";
import {
  detail,
  getUpload,
  postUpload,
  getEdit,
  postEdit,
  getDelete,
  postDelete,
} from "../controllers/productController";

const goodsRouter = express.Router();

goodsRouter.route("/upload").get(getUpload).post(postUpload);
goodsRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
goodsRouter.route("/:id([0-9a-f]{24})/delete").get(getDelete).post(postDelete);
goodsRouter.get("/:id([0-9a-f]{24})", detail);

export default goodsRouter;
