const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

router.use("/auth", require("./auth.routes"));
router.use("/categorys", require("./categorys.routes"));
router.use("/posts", require("./posts.routes"));

// if route not found
router.use("*", (req, res, next) => {
  try {
    let err = new Error("Not Found");
    err.status = 404;
    throw err;
  } catch (error) {
    next(error);
  }
});
// errorHandler
router.use(require("../middlewares/errorHandler"));

module.exports = router;
