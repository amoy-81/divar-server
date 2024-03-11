const autoBind = require("auto-bind");

const createHttpError = require("http-errors");
const joiUtil = require("../utilities/validation/joi.util");
const commentModel = require("../models/comment.model");
const postsModel = require("../models/posts.model");

class CommentController {
  constructor() {
    autoBind(this);
  }

  async createNewComment(req, res, next) {
    try {
      joiUtil.createNewComment(req.body);

      const [post] = await postsModel.getOnePostById(req.body.post_id)

      if (!post) throw new createHttpError.NotFound("پست یافت نشد")

      const newComment = await commentModel.createComment(
        req.user.id,
        req.body.post_id,
        req.body.message
      );

      return res.status(201).json({ id: newComment });
    } catch (error) {
      next(error);
    }
  }

  async getPostComments(req, res, next) {
    try {
      const posts = await commentModel.getPostComments(req.params.id);
      return res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CommentController();
