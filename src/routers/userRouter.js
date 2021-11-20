import express from "express";

const userRouter = express.Router();

userRouter.get("/:id");
userRouter.route("/edit").get();
userRouter.route("/delete").get();
userRouter.route("/change-password").get();
userRouter.route("/basket").get();
userRouter.route("/bid-list").get();
userRouter.route("/logout").get();

export default userRouter;
