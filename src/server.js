import express from "express";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import goodsRouter from "./routers/goodsRouter";

const app = express();

// app.use("/", rootRouter);
// app.use("/users", userRouter);
// app.use("/goods", goodsRouter);

export default app;
