const User = require("../models/User");

module.exports = {
  verifyPermission(roles) {
    return (req, res, next) => {
      const { user_id } = req;

      try {
        const user = User.findOne({ _id: user_id });

        if (!user) {
          return res.status(404).send({
            message: "Usuário não encontrado!",
          });
        }

        if (!roles.includes(user.role)) {
          return res.status(401).send({
            message: "Usuário não possui permissão!",
          });
        }

        next();
      } catch (err) {
        return res.status(500).send({
          message: err.message || "Algo deu errado!",
        });
      }
    };
  },
};
