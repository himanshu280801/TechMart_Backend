import express from "express";
import mongoose from "mongoose";
import userRouter from "./Routes/user.js";
import bodyParser from "express";
import productRouter from './Routes/product.js';
import cartRouter from './Routes/cart.js';
import addressRouter from './Routes/address.js';
import cors from "cors";

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin:true,
  methods:[ "GET","POST","PUT","DELETE"],
  credentials:true
}))
//Testing home route
app.get("/", (req, res) => res.json({ message: "This is home route" }));

//user Router
app.use("/api/user", userRouter);
//product Router
app.use('/api/product',productRouter);
//cart router
app.use('/api/cart',cartRouter);
// address Router
app.use('/api/address',addressRouter)

mongoose
  .connect(
    "mongodb+srv://himanshuug21ec:iA5BSPdNnHmEfqgE@cluster0.hbtxadg.mongodb.net/",
    {
      dbName: "MERN_E_COMMERCE_WEBSITE",
    }
  )
  .then(() => console.log("Mongodb connected successfully"));
const port = 1000;
app.listen(port, () => {
  console.log(`server is running at port no ${port}`);
});
