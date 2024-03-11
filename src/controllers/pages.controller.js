const autoBind = require("auto-bind");

class PageController {
  constructor() {
    autoBind(this);
  }

  async renderHomePage(req, res, next) {
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
}

module.exports = new PageController();
