const autoBind = require("auto-bind");
const db = require("../configs/db.config");

class CommentModel {
  constructor() {
    autoBind(this);
  }

  async createComment(user_id, post_id, message) {
    const [result] = await db.query(
      `INSERT INTO comments (user_id, post_id, message) VALUES(?,?,?)`,
      [user_id, post_id, message]
    );

    return result.insertId;
  }

  async getPostComments(post_id) {
    const [result] = await db.query(
      `SELECT c.*, u.name as user_name FROM comments c JOIN users u ON c.user_id = u.id  WHERE c.post_id = ?`,
      [post_id]
    );

    return result;
  }
}

module.exports = new CommentModel();
