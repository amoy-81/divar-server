const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middlewares/auth.middleware");
const postsController = require("../controllers/posts.controller");

const upload = multer({ storage: multer.memoryStorage() });
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  postsController.createNewPost
);

module.exports = router;
