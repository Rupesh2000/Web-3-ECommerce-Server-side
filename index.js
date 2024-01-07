const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const cors = require("cors");

const Product = mongoose.model("Product", {
  title: String,
  price: Number,
  image: String,
  rating: Object,
});

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.json({ message: "All good" });
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (error) {
    res.json({ error });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const { title, price, image, ratingStars, ratingCount } = req.body;
    const rating = { rate: ratingStars, count: ratingCount };
    await Product.create({ title, price, image, rating });
    res.json({ status: "SUCCESS", message: "Product added successfully" });
  } catch (error) {
    res.json({ status: "FAIL", message: error });
  }
});

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`Server is running on PORT : ${process.env.PORT}`))
    .catch((error) => console.log(error));
});
