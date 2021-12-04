import express from "express";
import path from "path";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import goodsRouter from "./routers/productRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";
import Product from "./models/Product";

const app = express();
const logger = morgan("dev");

let cors = require("cors");
app.use(cors());

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/img", express.static("img"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/products", goodsRouter);
app.use("/api", apiRouter);

setInterval(async () => {
  try {
    const products = await Product.find({
      endCheck: "false",
    });
    const nowAt = new Date().getTime();
    for (let product of products) {
      const endAt = new Date(product.period).getTime();
      const timeResult = endAt - nowAt;
      if (timeResult < 0) {
        product.endCheck = true;
        product.save();
      }
    }
  } catch (e) {
    console.log(e);
  }
}, 1000 * 60);

export default app;
