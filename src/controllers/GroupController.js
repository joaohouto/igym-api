const Group = require("../models/Group");

module.exports = {
  async create(req, res) {
    const { name, price, deadlineDay } = req.body;

    const group = new Group({ name, price, deadlineDay });

    try {
      await group.save();
      return res.json({ group });
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  },

  async findAll(req, res) {
    try {
      const groups = await Group.find();
      return res.json({ groups });
    } catch (err) {
      return res
        .status(500)
        .send({ message: err.message || "Algo deu errado!" });
    }
  },

  async findOne(req, res) {
    try {
      const group = await Group.findById(req.params.group_id);

      if (!group) {
        return res.status(404).send({
          message: "Item não encontrado com o id " + req.params.group_id,
        });
      }

      return res.json({ group });
    } catch (err) {
      return res
        .status(500)
        .send({ message: err.message || "Algo deu errado!" });
    }
  },

  async update(req, res) {
    try {
      const group = await Group.findByIdAndUpdate(
        req.params.group_id,
        {
          name: req.body.name,
          price: req.body.price,
          deadlineDay: req.body.deadlineDay,
        },
        { new: true }
      );

      if (!group) {
        return res.status(404).send({
          message: "Item não encontrado com o id " + req.params.group_id,
        });
      }

      res.send(group);
    } catch (err) {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Item não encontrado com o id " + req.params.group_id,
        });
      }

      res.status(500).send({
        message:
          "Algo deu errado ao atualizar o item com id " + req.params.group_id,
      });
    }
  },

  async delete(req, res) {
    try {
      const group = await Group.findByIdAndDelete(req.params.group_id);

      if (!group) {
        return res.status(404).send({
          error: "Item não encontrado com o id " + req.params.group_id,
        });
      }

      res.send({ message: "Item deletado!" });
    } catch (err) {
      return res
        .status(500)
        .send({ message: err.message || "Algo deu errado!" });
    }
  },
};
