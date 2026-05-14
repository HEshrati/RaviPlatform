const express = require("express");
const router = express.Router();
const User = require("../models/User"); // مسیر مدل User را بررسی کنید

// Middleware برای بررسی ادمین بودن
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ mobileNumber: req.user?.mobileNumber });
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "فقط ادمین مجاز است" });
    }
    next();
  } catch (e) {
    res.status(500).json({ error: "خطای سرور" });
  }
};

// ارتقاء به ادمین
router.patch("/users/:id/make-admin", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "کاربر یافت نشد" });
    user.isAdmin = true;
    await user.save();
    res.json({ success: true, user: { id: user._id, name: user.name, isAdmin: true } });
  } catch (e) {
    res.status(500).json({ error: "خطا در ذخیره" });
  }
});

// حذف دسترسی ادمین
router.patch("/users/:id/remove-admin", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "کاربر یافت نشد" });
    user.isAdmin = false;
    await user.save();
    res.json({ success: true, user: { id: user._id, name: user.name, isAdmin: false } });
  } catch (e) {
    res.status(500).json({ error: "خطا در ذخیره" });
  }
});

module.exports = router;
