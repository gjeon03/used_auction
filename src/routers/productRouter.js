import express from "express";

const goodsRouter = express.Router();

goodsRouter.get("/:id([0-9a-f]{24})");
goodsRouter.route("/:id([0-9a-f]{24})/upload").get();
goodsRouter.route("/:id([0-9a-f]{24})/edit").get();
goodsRouter.route("/:id([0-9a-f]{24})/delete").get();

export default goodsRouter;
