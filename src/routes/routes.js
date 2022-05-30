const express = require("express");

const router = express.Router();

const { register, login, checkAuth } = require("../controllers/users");

const {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  editProduct,
} = require("../controllers/products");

const { auth } = require("../middlewares/auth");

const { uploadImage } = require("../middlewares/uploadImage");

router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

router.post("/product", auth, uploadImage("image"), addProduct);
router.delete("/product/:id", deleteProduct);
router.patch("/product/:id", auth, uploadImage("image"), editProduct);
router.get("/product/:id", getProduct);
router.get("/products", getProducts);

module.exports = router;
