const User = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports = {
  async create(req, res) {
    const { name, email, password } = req.body;

    const user = new User({ name, email, password });

    try {
      await user.save();
      return res.json({ user });
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  },

  async findAll(req, res) {
    try {
      const users = await User.find();

      return res.json({ users });
    } catch (err) {
      return res
        .status(500)
        .send({ message: err.message || "Algo deu errado!" });
    }
  },

  async findOne(req, res) {
    try {
      const user = await User.findById(req.params.user_id);
      return res.json({ user });
    } catch (err) {
      return res
        .status(500)
        .send({ message: err.message || "Algo deu errado!" });
    }
  },

  async update(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.user_id,
        {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).send({
          message: "Usuário não encontrado com o id " + req.params.user_id,
        });
      }

      res.send(user);
    } catch (err) {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Usuário não encontrado com o id " + req.params.user_id,
        });
      }

      res.status(500).send({
        message:
          "Algo deu errado ao atualizar o usuário com id " + req.params.move_id,
      });
    }
  },

  async delete(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.user_id);

      if (!user) {
        return res.status(404).send({
          error: "Usuário não encontrado com o id " + req.params.user_id,
        });
      }

      res.send({ message: "Usuário deletado!" });
    } catch (err) {
      return res
        .status(500)
        .send({ message: err.message || "Algo deu errado!" });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select("+password");

      if (!user)
        return res.status(404).json({
          message: "Usuário não encontrado.",
        });

      const passwordIsValid = await user.validatePassword(password);

      if (passwordIsValid) {
        const { _id } = user;

        const token = jwt.sign({ _id }, process.env.SECRET, {
          expiresIn: "1d",
        });

        return res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
          },
          token,
        });
      }

      return res.status(401).json({
        auth: false,
        message: "Senha inválida!",
      });
    } catch (err) {
      return res.status(500).send({
        message: err.message || "Algo deu errado!",
      });
    }
  },
};
