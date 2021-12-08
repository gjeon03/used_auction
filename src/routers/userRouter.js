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
  startGithubLogin,
  finishGithubLogin,
  startKakaoLogin,
  finishKakaoLogin,
  deleteKakao,
} from "../controllers/userController";
import {
  avatarUpload,
  protectorMiddleware,
  publicOnlyMiddleware,
  s3DeleteAvatarMiddleware,
} from "../middlewares";

const userRouter = express.Router();

userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), s3DeleteAvatarMiddleware, postEdit);
userRouter.route("/delete").get(getDelete).post(postDelete);
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/bid-list", getBidList);
userRouter.get("/logout", protectorMiddleware, logout);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/kakao/start", publicOnlyMiddleware, startKakaoLogin);
userRouter.get("/kakao/finish", publicOnlyMiddleware, finishKakaoLogin);
userRouter.get("/kakao/finish", deleteKakao);

userRouter.get("/:id([0-9a-f]{24})", profile);

export default userRouter;
