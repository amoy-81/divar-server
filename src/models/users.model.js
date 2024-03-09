const autoBind = require("auto-bind");
const db = require("../configs/db.config");

class UsersModel {
  constructor() {
    autoBind(this);
  }
  async getUserByMobile(mobile) {
    const [user] = await db.query("SELECT * FROM users WHERE mobile = ?", [
      mobile,
    ]);
    return user;
  }

  async getUserById(id) {
    const [user] = await db.query("SELECT * FROM users WHERE id = ?", [
      id,
    ]);
    return user;
  }

  async createNewUser(name, mobile) {
    const [user] = await db.query(
      "INSERT INTO users (name , mobile) VALUE (?, ?)",
      [name, mobile]
    );
    return user.insertId;
  }

  async createNewOTP(mobile, OTPData) {
    const [user] = await db.query(
      "UPDATE users SET otp_code = ? ,otp_expires_in = ? WHERE mobile = ?",
      [OTPData.code, OTPData.expired_date, mobile]
    );
    return this.getUserByMobile(mobile);
  }

  async deleteOTP(mobile) {
    const [user] = await db.query(
      "UPDATE users SET otp_code = null ,otp_expires_in = 0 WHERE mobile = ?",
      [mobile]
    );
    return this.getUserByMobile(mobile);
  }
}

module.exports = new UsersModel();
