const dayjs = require("dayjs");
const RefreshToken = require("../models/RefreshToken");

module.exports = {
  async generate(userId) {
    try {
      const expiresIn = dayjs().add(30, "days").unix();

      const refreshToken = new RefreshToken({
        userId: userId,
        expiresIn: expiresIn,
      });
      await refreshToken.save();

      return refreshToken._id;
    } catch (err) {
      console.log(err);
    }
  },
};
