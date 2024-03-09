const autoBind = require("auto-bind");

const createHttpError = require("http-errors");
const joiUtil = require("../utilities/validation/joi.util");
const saveInStorage = require("../utilities/firebase/firebase.util");
const postsModel = require("../models/posts.model");

class PostsController {
  constructor() {
    autoBind(this);
  }

  async createNewPost(req, res, next) {
    try {
      joiUtil.createPostValidation(req.body);
      const imageDownloadUrl = await saveInStorage(req.file);

      const newPostData = {
        ...req.body,
        user_id: req.user.id,
        image: imageDownloadUrl,
      };

      const newPostId = await postsModel.createPosts(newPostData);

      return res.status(201).json({ id: newPostId });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostsController();
