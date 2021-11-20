import express from "express";
import path from "path";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import goodsRouter from "./routers/productRouter";
import reviewRouter from "./routers/reviewRouter";

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/products", goodsRouter);
app.use("/reviews", reviewRouter);

export default app;
