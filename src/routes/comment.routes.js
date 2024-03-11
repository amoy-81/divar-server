const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const commentController = require("../controllers/comment.controller");

router.post("/", authMiddleware, commentController.createNewComment);
router.get("/:id", commentController.getPostComments);

module.exports = router;
