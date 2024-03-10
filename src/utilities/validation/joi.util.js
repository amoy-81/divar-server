const autoBind = require("auto-bind");
const Joi = require("joi");

class JoiValidation {
  constructor() {
    autoBind(this);
  }

  checkValidation(schema, body) {
    // Perform the joi validation on given body against defined
    const validationResult = Joi.object(schema).validate(body);

    //  If any error found in request, send back the error with status code 500
    if (validationResult.error) throw validationResult.error;
  }

  registerValidation(body) {
    // Define validation schema for user registration.
    const schema = {
      name: Joi.string().max(50).required(),
      mobile: Joi.string().min(11).max(13).required(),
    };

    this.checkValidation(schema, body);
  }

  loginValidation(body) {
    // Define validation schema for user registration.
    const schema = {
      mobile: Joi.string().min(11).max(13).required(),
    };

    this.checkValidation(schema, body);
  }

  checkOTP(body) {
    // Define validation schema for user registration.
    const schema = {
      mobile: Joi.string().min(11).max(13).required(),
      code: Joi.string().min(4).max(4).required(),
    };

    this.checkValidation(schema, body);
  }

  createCategorysValidation(body) {
    // Define validation schema for user registration.
    const schema = {
      name: Joi.string().required(),
      slug: Joi.string().required(),
      icon: Joi.string(),
    };

    this.checkValidation(schema, body);
  }

  createPostValidation(body) {
    // Define validation schema for user registration.
    const schema = {
      title: Joi.string().required(),
      category_id: Joi.number().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
      address: Joi.string().required(),
    };
    this.checkValidation(schema, body);
  }

  createOrderValidation(body) {
    // Define validation schema for user registration.
    const schema = {
      post_id: Joi.number().required(),
      proposed_price: Joi.number().required(),
      message: Joi.string().required(),
    };
    this.checkValidation(schema, body);
  }

  checkOrderValidation(body) {
    // Define validation schema for user registration.
    const schema = {
      order_id: Joi.number().required(),
      action: Joi.string().valid("accept", "reject").required(),
    };
    this.checkValidation(schema, body);
  }
}

module.exports = new JoiValidation();
