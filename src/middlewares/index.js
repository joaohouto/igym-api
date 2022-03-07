const { verifyToken } = require("./auth");
const { verifyPermission } = require("./permission");

module.exports = {
  middlewares(req, res, next) {
    verifyToken(req, res, next);
    verifyPermission(req, res, next);
  },
};
