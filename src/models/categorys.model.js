const autoBind = require("auto-bind");
const db = require("../configs/db.config");

class CategorysModel {
  constructor() {
    autoBind(this);
  }

  async getCategorys() {
    const [categorys] = await db.query("SELECT * FROM categorys");
    return categorys;
  }

  async getPostsByCategory(slug) {
    const [categorys] = await db.query("SELECT * FROM posts WHERE category_id IN (SELECT id FROM categorys WHERE slug = ?)" , [slug]);
    return categorys;
  }

  async createCategory(name, slug, icon) {
    const [result] = await db.query(
      `INSERT INTO categorys (name,slug,icon) VALUES(?,?,?)`,
      [name, slug, icon]
    );

    return result.insertId;
  }
}

module.exports = new CategorysModel();
