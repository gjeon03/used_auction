import express from "express";
import {
  createComment,
  deleteComment,
  postToBid,
} from "../controllers/productController";

const apiRouter = express.Router();

apiRouter.post("/products/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete("/comments/:id([0-9a-f]{24})", deleteComment);
apiRouter.post("/product/bid/:id([0-9a-f]{24})", postToBid);

export default apiRouter;
