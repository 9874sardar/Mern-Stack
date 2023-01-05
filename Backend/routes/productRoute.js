const express = require("express");
const { getAllProducts , createProduct,updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");

const router = express.Router();

//TO GET THE DETAILS OF ALL PRODUCT
router.route("/products").get(getAllProducts);

// TO CREATE A NEW PRODUCT
router.route("/product/new").post(createProduct);

//TO DELETE A PRODUCT
router.route("/product/:id").put(updateProduct).delete(deleteProduct).get(getProductDetails);

module.exports = router