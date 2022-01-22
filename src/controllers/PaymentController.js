const Payment = require("../models/Payment");
const mongoose = require("mongoose");
const moment = require("moment");

module.exports = {
  async create(req, res) {
    const { student_id, group_id, date, amount } = req.body;

    const payment = new Payment({
      student_id,
      group_id,
      date,
      amount,
    });

    try {
      await payment.save();
      return res.json({ payment });
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  },

  async findAll(req, res) {
    const { date, group_id } = req.query;

    try {
      let payments = await Payment.aggregate([
        {
          $addFields: { month: { $month: "$date" }, year: { $year: "$date" } },
        },
        {
          $match: group_id
            ? {
                month: parseInt(moment(date, "YYYY-MM-DD").format("MM")),
                year: parseInt(moment(date, "YYYY-MM-DD").format("YYYY")),
                group_id: mongoose.Types.ObjectId(group_id),
              }
            : {
                month: parseInt(moment(date, "YYYY-MM-DD").format("MM")),
                year: parseInt(moment(date, "YYYY-MM-DD").format("YYYY")),
              },
        },
        { $sort: { date: -1 } },
      ]);

      payments = await Payment.populate(payments, {
        path: "group_id",
      });

      payments = await Payment.populate(payments, {
        path: "student_id",
        select: "name",
      });

      return res.json({ payments });
    } catch (err) {
      return res
        .status(500)
        .send({ message: err.message || "Algo deu errado!" });
    }
  },

  async findOne(req, res) {
    try {
      const payment = await Payment.findById(req.params.payment_id)
        .populate({
          path: "group_id",
        })
        .populate({
          path: "student_id",
        });

      if (!payment) {
        return res.status(404).send({
          message: "Item não encontrado com o id " + req.params.payment_id,
        });
      }

      return res.json({ payment });
    } catch (err) {
      return res
        .status(500)
        .send({ message: err.message || "Algo deu errado!" });
    }
  },

  async update(req, res) {
    try {
      const payment = await Payment.findByIdAndUpdate(
        req.params.payment_id,
        {
          student_id: req.body.student_id,
          group_id: req.body.group_id,
          date: req.body.date,
          amount: req.body.amount,
        },
        { new: true }
      );

      if (!payment) {
        return res.status(404).send({
          message: "Item não encontrado com o id " + req.params.payment_id,
        });
      }

      res.send(Payment);
    } catch (err) {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Item não encontrado com o id " + req.params.payment_id,
        });
      }

      res.status(500).send({
        message:
          "Algo deu errado ao atualizar o item com id " + req.params.payment_id,
      });
    }
  },

  async delete(req, res) {
    try {
      const payment = await Payment.findByIdAndDelete(req.params.payment_id);

      if (!payment) {
        return res.status(404).send({
          error: "Item não encontrado com o id " + req.params.payment_id,
        });
      }

      res.send({ message: "Item deletado!" });
    } catch (err) {
      return res
        .status(500)
        .send({ message: err.message || "Algo deu errado!" });
    }
  },

  async findByStudent(req, res) {
    const { student_id } = req.params;

    try {
      const payments = await Payment.find({ student_id })
        .populate({
          path: "group_id",
        })
        .populate({
          path: "student_id",
        })
        .sort({ date: -1 });

      return res.json({ payments });
    } catch (err) {
      return res
        .status(500)
        .send({ message: err.message || "Algo deu errado!" });
    }
  },
};
