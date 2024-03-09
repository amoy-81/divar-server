const autoBind = require("auto-bind");
const categorysModel = require("../models/categorys.model");
const createHttpError = require("http-errors");
const joiUtil = require("../utilities/validation/joi.util");

class CategorysController {
  constructor() {
    autoBind(this);
  }

  async getAllCategorys(req, res, next) {
    try {
      const categorys = await categorysModel.getCategorys();
      return res.status(200).json({
        status: "success",
        data: {
          categorys,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async createCategorys(req, res, next) {
    try {
      if (req.user.role !== "ADMIN")
        throw new createHttpError.Forbidden("شما اجازه این کار را ندارید");

      joiUtil.createCategorysValidation(req.body);

      const result = await categorysModel.createCategory(
        req.body.name,
        req.body.slug,
        req.body.icon !== undefined ? req.body.icon : "cursor"
      );

      return res.status(201).json({
        status: "success",
        message: "دسته بندی با موفقیت ثبت شد.",
        id: result._id,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategorysController();
