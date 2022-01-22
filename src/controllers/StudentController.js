const Student = require("../models/Student");

module.exports = {
  async create(req, res) {
    const { name, phone, birth, cpf, address, groups } = req.body;

    const student = new Student({ name, phone, birth, cpf, address, groups });

    try {
      await student.save();
      return res.json({ student });
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  },

  async findAll(req, res) {
    var name = new RegExp(req.query.name, "i");

    try {
      const students = await Student.find({ name }).populate({
        path: "groups.group_id",
      });

      return res.json({ students });
    } catch (err) {
      return res
        .status(500)
        .send({ message: err.message || "Algo deu errado!" });
    }
  },

  async findOne(req, res) {
    try {
      const student = await Student.findById(req.params.student_id).populate({
        path: "groups.group_id",
      });

      if (!student) {
        return res.status(404).send({
          message: "Item não encontrado com o id " + req.params.student_id,
        });
      }

      return res.json({ student });
    } catch (err) {
      return res
        .status(500)
        .send({ message: err.message || "Algo deu errado!" });
    }
  },

  async update(req, res) {
    try {
      const student = await Student.findByIdAndUpdate(
        req.params.student_id,
        {
          name: req.body.name,
          phone: req.body.phone,
          birth: req.body.birth,
          cpf: req.body.cpf,
          address: req.body.address,
          groups: req.body.groups,
        },
        { new: true }
      );

      if (!student) {
        return res.status(404).send({
          message: "Item não encontrado com o id " + req.params.student_id,
        });
      }

      res.send(student);
    } catch (err) {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Item não encontrado com o id " + req.params.student_id,
        });
      }

      res.status(500).send({
        message:
          "Algo deu errado ao atualizar o item com id " + req.params.student_id,
      });
    }
  },

  async delete(req, res) {
    try {
      const student = await Student.findByIdAndDelete(req.params.student_id);

      if (!student) {
        return res.status(404).send({
          error: "Item não encontrado com o id " + req.params.student_id,
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
