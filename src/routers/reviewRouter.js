import express from "express";

const reviewRouter = express.Router();

reviewRouter.get("/");
reviewRouter.route("/upload").get();
reviewRouter.route("/:id([0-9a-f]{24})").get();
reviewRouter.route("/:id([0-9a-f]{24})/edit").get();
reviewRouter.route("/:id([0-9a-f]{24})/delete").get();

export default reviewRouter;
