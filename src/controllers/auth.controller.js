const autoBind = require("auto-bind");
const usersModel = require("../models/users.model");
const _ = require("lodash");
const joiUtil = require("../utilities/validation/joi.util");
const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const authMessages = require("../messages/auth.messages");

class AuthController {
  constructor() {
    autoBind(this);
  }

  async register(req, res, next) {
    try {
      // Validate user data using Joi validation schema
      joiUtil.registerValidation(req.body);

      // Check if user already exists in the database
      const findUser = await usersModel.getUserByMobile(req.body.mobile);

      // If user is found send error message otherwise continue to
      if (findUser.length > 0)
        throw new createHttpError.Conflict(authMessages.conflict);

      // Create a new user and save it into the database
      const newUserId = await usersModel.createNewUser(
        req.body.name,
        req.body.mobile
      );

      // Generate OTP code for the newly created user
      const userWithOTP = await this.createOTP(req.body.mobile);

      // Send response with generated OTP
      return res.status(201).json({
        id: newUserId,
        message: authMessages.createSuccess,
        otp: _.pick(userWithOTP, ["otp_code"]),
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      // Validate user data using Joi validation schema
      joiUtil.loginValidation(req.body);

      // Check if user already exists in the database
      const findUser = await usersModel.getUserByMobile(req.body.mobile);

      // If user is found send error message otherwise continue to
      if (findUser.length == 0)
        throw new createHttpError.NotFound(authMessages.notFound);

      // Generate OTP code for the newly created user
      const userWithOTP = await this.createOTP(req.body.mobile);

      // Send response with generated OTP
      return res.status(200).json({
        message: authMessages.OTPGenerated,
        otp: _.pick(userWithOTP, ["otp_code"]),
      });
    } catch (error) {
      next(error);
    }
  }

  async checkOTP(req, res, next) {
    try {
      // Validate user data using Joi validation schema
      joiUtil.checkOTP(req.body);

      // Check if user already exists in the database
      const findUser = await usersModel.getUserByMobile(req.body.mobile);

      // If user is found send error message otherwise continue to
      if (findUser.length == 0)
        throw new createHttpError.NotFound(authMessages.notFound);

      const now = new Date().getTime();
      // Compare provided OTP with stored one and delete
      if (
        findUser[0].otp_code != req.body.code ||
        parseInt(findUser[0].otp_expires_in) < now
      )
        throw createHttpError.Conflict("کد تایید نامعتبر");

      // Delete OTP from the user object
      await usersModel.deleteOTP(req.body.mobile);

      // Create access token and set it on
      const token = jwt.sign(
        { id: findUser[0].id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "3h" }
      );

      // Send response with generated OTP
      return res.status(200).json({
        message: "ورود با موفقیت انجام شد",
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async createOTP(mobile) {
    // Generate random 6 digit number as OTP
    const code = Math.floor(Math.random() * 9999 + 1000).toString();

    // Set expiration time of OTP as per configuration
    const now = new Date().getTime();

    // Save OTP details
    const OTPData = {
      code,
      expired_date: now + 1000 * 60 * 2,
    };
    console.log(OTPData);

    // Update OTP in the users Table
    const [UserWithNewOTP] = await usersModel.createNewOTP(mobile, OTPData);

    // Return User object OTP information
    return UserWithNewOTP;
  }
}

module.exports = new AuthController();
