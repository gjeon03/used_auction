import express from "express";
import {
  getEdit,
  getUpload,
  postEdit,
  postUpload,
  reviewDetail,
  reviewHome,
  getDelete,
  postDelete,
} from "../controllers/reviewController";

const reviewRouter = express.Router();

reviewRouter.get("/", reviewHome);
reviewRouter.route("/upload").get(getUpload).post(postUpload);
reviewRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
reviewRouter.route("/:id([0-9a-f]{24})/delete").get(getDelete).post(postDelete);
reviewRouter.get("/:id([0-9a-f]{24})", reviewDetail);

export default reviewRouter;
