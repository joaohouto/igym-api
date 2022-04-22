const mongoose = require("mongoose");
const moment = require("moment");

const Student = require("../models/Student");
const Payment = require("../models/Payment");

module.exports = {
  async getEarnings(req, res) {
    const { date, group_id } = req.query;

    try {
      let estimated = 0;
      let waiting = 0;
      let received = 0;

      let students = await Student.find().populate("groups.group_id");

      students.map((student) => {
        student.groups.map((group) => {
          if (group_id) {
            if (group_id == group.group_id._id)
              estimated += group.group_id.price - group.discount;
          } else {
            estimated += group.group_id.price - group.discount;
          }
        });
      });

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
      ]);

      payments.map((payment) => (received += payment.amount));

      waiting = estimated - received;

      return res.json({
        estimated,
        waiting,
        received,
      });
    } catch (err) {
      return res
        .status(500)
        .send({ message: err.message || "Algo deu errado!" });
    }
  },

  async getPendings(req, res) {
    const { date, group_id } = req.query;

    try {
      let pendings = [];
      let waiting = [];

      let students = await Student.find().populate("groups.group_id");

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
      ]);

      students.map((student) => {
        student.groups.map((group) => {
          waiting.push({
            student_id: student._id,
            group_id: group.group_id._id,
            amount: group.group_id.price * (1 - group.discount / 100),
          });
        });
      });

      pendings = waiting.map((item) => {
        payments.map((payment) => {
          if (
            item.student_id != mongoose.Types.ObjectId(payment.student_id) &&
            item.group_id != mongoose.Types.ObjectId(payment.group_id)
          ) {
            return item;
          }
        });
      });

      console.log(waiting);

      return res.json({
        pendings,
      });
    } catch (err) {
      return res
        .status(500)
        .send({ message: err.message || "Algo deu errado!" });
    }
  },
};
