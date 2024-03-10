const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const ordersController = require("../controllers/orders.controller");

router.get("/", authMiddleware, ordersController.getOrders);
router.get("/my-orders", authMiddleware, ordersController.getUserOrders);

router.post("/", authMiddleware, ordersController.createNewOrder);
router.put("/check", authMiddleware, ordersController.checkOrder);

router.get("/:id", authMiddleware, ordersController.getOneOrder);

module.exports = router;
