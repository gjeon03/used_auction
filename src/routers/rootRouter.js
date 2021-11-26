import express from "express";
import { category, home } from "../controllers/productController";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/userController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/category/:category", category);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);

export default rootRouter;
