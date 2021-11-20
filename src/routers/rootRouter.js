import express from "express";

const rootRouter = express.Router();

rootRouter.get("/");
rootRouter.route("/join").get();
rootRouter.route("/login").get();

export default rootRouter;
