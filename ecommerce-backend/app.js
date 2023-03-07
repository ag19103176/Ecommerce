require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripePayment");

//Db Connection
mongoose
  .connect(
    `mongodb+srv://admin:12345@cluster0.kcd8el7.mongodb.net/ecommerceApp?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("DB CONNECTED!");
  });

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
//app.use("/api",stripeRoutes);

//port
const port = process.env.PORT || 8000;

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  // const path=require("path");
  // app.get("*",(req,res)=>{
  //     res.sendFile(path.resolve(__dirname,'client','build','index.html'));
  // })
}

//server listen
app.listen(port, () => {
  console.log(`app is running at ${port}!`);
});
