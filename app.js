const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();
const app = express();
const api = process.env.API_URL;

//middlewares
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(morgan("tiny"));

//routers
const productsRouter = require("./routers/products");
const cateogriesRouter = require("./routers/categories");
const usersRouter = require("./routers/users");
const ordersRouter = require("./routers/orders");

app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, cateogriesRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => console.log(e));

app.listen(3000, () => {
  console.log(`Server is running on PORT 3000`);
});
