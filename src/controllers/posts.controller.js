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

  async getAllposts(req, res, next) {
    try {
      const posts = await postsModel.getPosts();
      return res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }

  async getPostById(req, res, next) {
    try {
      const [post] = await postsModel.getOnePostById(req.params.id);
      if (!post) throw new createHttpError.NotFound("پست وجود ندارد");
      return res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  async getMyPosts(req, res, next) {
    try {
      const posts = await postsModel.getUserPostsById(req.user.id);
      return res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostsController();
