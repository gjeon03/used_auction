import express from "express";
import {
  profile,
  getEdit,
  postEdit,
  getDelete,
  postDelete,
  getChangePassword,
  postChangePassword,
  getBidList,
  logout,
} from "../controllers/userController";
import { avatarUpload } from "../middlewares";

const userRouter = express.Router();

userRouter
  .route("/edit")
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);
userRouter.route("/delete").get(getDelete).post(postDelete);
userRouter
  .route("/change-password")
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/bid-list", getBidList);
userRouter.get("/logout", logout);
userRouter.get("/:id([0-9a-f]{24})", profile);

export default userRouter;
