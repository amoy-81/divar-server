const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const features = [
    { title: "احرازهویت", desc: "ثبت نام با استفاده از کد تایید" },
    { title: "دسته بندی", desc: "ایجاد دسته بندی توسط مدیر" },
    { title: "آگهی ها", desc: "ایجاد آگهی توست کاربران" },
    {
      title: "پیشنهاد خرید",
      desc: "سفارش و پیشنهاد خرید توسط کاربران دیگر باری هر آگهی",
    },
    {
      title: "رسیدگی به پشنهادات",
      desc: "تایید و یا رد پیشنهاد توسط صاحب آگهی",
    },
    { title: "نظرات", desc: "نوشتن نظر برای هر آگهی توسط کاربران" },
  ];
  res.render("index", { features });
});

module.exports = router;
