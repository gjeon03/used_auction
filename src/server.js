import express from "express";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import goodsRouter from "./routers/productRouter";
import reviewRouter from "./routers/reviewRouter";

const app = express();

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/products", goodsRouter);
app.use("/reviews", reviewRouter);

export default app;
