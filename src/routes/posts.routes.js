const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middlewares/auth.middleware");
const postsController = require("../controllers/posts.controller");

const upload = multer({ storage: multer.memoryStorage() });
router.get("/", postsController.getAllposts);
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  postsController.createNewPost
);

router.get("/my-posts", authMiddleware, postsController.getMyPosts);

router.get("/:id", postsController.getPostById);

module.exports = router;
