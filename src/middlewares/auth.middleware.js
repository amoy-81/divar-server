const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const authMessages = require("../messages/auth.messages");
const usersModel = require("../models/users.model");

const authMiddleware = async (req, res, next) => {
  try {
    const { authorization } = req?.headers;
    if (!authorization)
      throw new createHttpError.Unauthorized(authMessages.unauthorized);
    const [bearer, token] = authorization?.split(" ");

    if (!token)
      throw new createHttpError.Unauthorized(authMessages.unauthorized);

    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (typeof data === "object" && "id" in data) {
      const [user] = await usersModel.getUserById(data.id);

      if (!user) throw new createHttpError.Unauthorized(authMessages.notFound);

      req.user = user;
      return next();
    }
    throw new createHttpError.Unauthorized(authMessages.unauthorized);
  } catch (error) {
    next(error);
  }
};
module.exports = authMiddleware;
