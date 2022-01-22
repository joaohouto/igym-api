const jwt = require("jsonwebtoken");

module.exports = {
  verifyToken(req, res, next) {
    const token = req.headers["x-access-token"];

    if (!token) {
      return res.status(401).json({
        auth: false,
        message: "O token de acesso não foi fornecido!",
      });
    }

    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        return res.status(500).json({
          auth: false,
          message: "Token de acesso inválido!",
        });
      }

      req.user_id = decoded._id;
      next();
    });
  },
};
