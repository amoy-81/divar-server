const autoBind = require("auto-bind");
const db = require("../configs/db.config");

class PostsModel {
  constructor() {
    autoBind(this);
  }

  async getPosts() {
    const [posts] = await db.query(`
      SELECT p.id, u.name as user_name, c.name as category ,p.title, p.price, p.image, p.address, p.created_at
      FROM posts p
      JOIN (users u, categorys c) 
        ON u.id = p.user_id AND c.id = p.category_id;`);
    return posts;
  }

  async getOnePostById(id) {
    const [posts] = await db.query(
      `
      SELECT p.id, p.user_id ,u.name as user_name, c.name as category ,p.title, p.description, p.price, p.image, p.address, p.created_at
      FROM posts p
      JOIN (users u, categorys c) 
        ON u.id = p.user_id AND c.id = p.category_id
      WHERE p.id = ?;`,
      [id]
    );
    return posts;
  }

  async getUserPostsById(id) {
    const [posts] = await db.query(
      `
      SELECT p.*, c.name as category
      FROM posts p
      JOIN (categorys c) 
        ON c.id = p.category_id
      WHERE p.user_id = ?;`,
      [id]
    );
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
