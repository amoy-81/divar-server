const autoBind = require("auto-bind");
const _ = require("lodash");
const db = require("../configs/db.config");

class OrdersModel {
  constructor() {
    autoBind(this);
  }

  async getOrderById(id) {
    const [result] = await db.query(
      `
        SELECT o.*, u.name as user_name
        FROM orders o
        JOIN users u ON o.user_id = u.id
        WHERE o.id = ?
      `,
      [id]
    );

    return result;
  }

  async createOrder(datas) {
    const [result] = await db.query(
      `INSERT INTO orders (user_id, post_id, proposed_price, message) VALUE (?, ?, ?, ?)`,
      [datas.user_id, datas.post_id, datas.proposed_price, datas.message]
    );

    return result.insertId;
  }

  async getUserOrdersById(id) {
    const [result] = await db.query(
      `
        SELECT 
            o.id,
            p.title as post_title,
            p.image as post_image,
            p.address as post_address,
            c.name as category_name,
            c.icon as category_icon,
            o.order_state, 
            o.proposed_price,
            o.message,
            o.created_at
        FROM orders o
        JOIN (posts p, categorys c) 
            ON o.post_id = p.id AND p.category_id = c.id
        WHERE o.user_id = ?
      `,
      [id]
    );

    const finalyResult = _.map(result, (value) => {
      const postKeys = [
        "post_title",
        "post_image",
        "post_address",
        "category_name",
        "category_icon",
      ];

      const post = _.pick(value, postKeys);
      const newObj = _.omit(value, postKeys);

      const finalyObj = _.merge(newObj, { post });
      return finalyObj;
    });

    return finalyResult;
  }

  async getOrders(id) {
    const [result] = await db.query(
      `
        SELECT 
            o.id,
            p.title as post_title,
            p.image as post_image,
            p.address as post_address,
            c.name as category_name,
            c.icon as category_icon,
            o.order_state, 
            u.name as client_name,
            o.proposed_price,
            o.message,
            o.created_at
        FROM orders o
        JOIN (posts p, users u, categorys c) 
            ON o.post_id = p.id AND o.user_id = u.id AND p.category_id = c.id
        WHERE p.user_id = ?
      `,
      [id]
    );

    const finalyResult = _.map(result, (value) => {
      const postKeys = [
        "post_title",
        "post_image",
        "post_address",
        "category_name",
        "category_icon",
      ];

      const post = _.pick(value, postKeys);
      const newObj = _.omit(value, postKeys);

      const finalyObj = _.merge(newObj, { post });
      return finalyObj;
    });

    return finalyResult;
  }

  async getOneOrderById(orderId, userId) {
    const [result] = await db.query(
      `
      SELECT o.*, p.user_id as post_user_id, p.id as post_id
        FROM orders o
        JOIN posts p 
          ON o.post_id = p.id
        WHERE o.id = ? AND (o.user_id = ? OR p.user_id = ?)
    `,
      [orderId, userId, userId]
    );

    return result;
  }

  async rejectOrder(orderId, userId) {
    const [result] = await db.query(
      `UPDATE orders SET order_state = 'failed' WHERE id = ?`,
      [orderId]
    );

    return await this.getOneOrderById(orderId, userId);
  }

  async acceptOrder(orderId, userId, postId) {
    const [acceptResult] = await db.query(
      `
        UPDATE orders 
        SET order_state = 
          CASE 
            WHEN id = ? THEN 'sold'
            WHEN id != ? AND post_id = ? THEN 'failed'
          ELSE order_state
          END;
      `,
      [orderId, orderId, postId]
    );

    return await this.getOneOrderById(orderId, userId);
  }

  async IsSoldOrder(postId) {
    const [IsExpectationResult] = await db.query(
      `
        SELECT * 
        FROM orders
        WHERE post_id = ? AND order_state = "sold"
      `,
      [postId]
    );

    return IsExpectationResult;
  }
}

module.exports = new OrdersModel();
