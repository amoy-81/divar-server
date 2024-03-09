const autoBind = require("auto-bind");
const db = require("../configs/db.config");

class PostsModel {
  constructor() {
    autoBind(this);
  }

  async getPosts() {
    const [posts] = await db.query("SELECT * FROM posts");
    return posts;
  }

  async createPosts(datas) {
    const [result] = await db.query(
      `INSERT INTO posts (
        user_id,
        category_id,
        title,
        description,
        price,
        image,
        address
        ) VALUES(?,?,?,?,?,?,?)`,
      [
        datas.user_id,
        datas.category_id,
        datas.title,
        datas.description,
        datas.price,
        datas.image,
        datas.address,
      ]
    );

    return result.insertId;
  }
}

module.exports = new PostsModel();
