const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const categorysController = require("../controllers/categorys.controller");

router.get("/", categorysController.getAllCategorys);
router.post("/", authMiddleware, categorysController.createCategorys);

router.get("/:slug", categorysController.getPostsByCategory);

module.exports = router;
