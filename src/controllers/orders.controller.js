const autoBind = require("auto-bind");

const _ = require("lodash");
const createHttpError = require("http-errors");
const joiUtil = require("../utilities/validation/joi.util");
const ordersModel = require("../models/orders.model");
const postsModel = require("../models/posts.model");

class OrdersController {
  constructor() {
    autoBind(this);
  }

  async createNewOrder(req, res, next) {
    try {
      joiUtil.createOrderValidation(req.body);

      const [selectedPost] = await postsModel.getOnePostById(req.body.post_id);

      if (!selectedPost || selectedPost.user_id == req.user.id)
        throw new createHttpError[400]("پست یافت یافت نشد");

      const IsSoldOrder = await ordersModel.IsSoldOrder(req.body.post_id);

      if (IsSoldOrder.length > 0)
        throw new createHttpError[400]("این محصول به فروش رسیده است");

      const newOrderData = { ...req.body, user_id: req.user.id };

      const newOrderId = await ordersModel.createOrder(newOrderData);

      return res.status(201).json({ id: newOrderId });
    } catch (error) {
      next(error);
    }
  }

  async getUserOrders(req, res, next) {
    try {
      const orders = await ordersModel.getUserOrdersById(req.user.id);
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req, res, next) {
    try {
      const orders = await ordersModel.getOrders(req.user.id);
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  async getOneOrder(req, res, next) {
    try {
      const [order] = await ordersModel.getOneOrderById(
        req.params.id,
        req.user.id
      );
      if (!order) throw new createHttpError.NotFound("سفارش وجود ندارد");
      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }

  async checkOrder(req, res, next) {
    try {
      joiUtil.checkOrderValidation(req.body);

      const [order] = await ordersModel.getOneOrderById(
        req.body.order_id,
        req.user.id
      );

      if (!order) throw new createHttpError.NotFound("سفارش وجود ندارد");

      if (order.post_user_id !== req.user.id)
        throw new createHttpError.Forbidden("شما به این دسترسی سفارش ندارید");

      if (order.order_state !== "expectation")
        throw new createHttpError[400]("سفارش قبلا نهایی شده است");

      if (req.body.action === "reject") {
        const [result] = await ordersModel.rejectOrder(
          req.body.order_id,
          req.user.id
        );

        const orderResponse = _.omit(result, ["post_user_id"]);

        return res
          .status(200)
          .json({ message: "سفارش رد شد", order: orderResponse });
      }

      if (req.body.action === "accept") {
        const [result] = await ordersModel.acceptOrder(
          req.body.order_id,
          req.user.id,
          order.post_id
        );

        const orderResponse = _.omit(result, ["post_user_id"]);

        return res
          .status(200)
          .json({ message: "سفارش تایید شد", order: orderResponse });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrdersController();
