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
import {
  productUpload,
  protectorMiddleware,
  userEmailAddressCheck,
} from "../middlewares";

const goodsRouter = express.Router();

goodsRouter
  .route("/upload")
  .all(protectorMiddleware)
  .all(userEmailAddressCheck)
  .get(getUpload)
  .post(productUpload.array("photo", 10), postUpload);
goodsRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
goodsRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(getDelete)
  .post(postDelete);
goodsRouter.get("/:id([0-9a-f]{24})", detail);

export default goodsRouter;
