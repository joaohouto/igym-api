const express = require("express");
const routes = express.Router();

const { verifyToken } = require("../middlewares/auth");

const UserController = require("../controllers/UserController");
const StudentController = require("../controllers/StudentController");
const GroupController = require("../controllers/GroupController");
const PaymentController = require("../controllers/PaymentController");
const StatsController = require("../controllers/StatsController");

//User
routes.route("/login").post(UserController.login);

//routes
//  .route("/users")
//  .post(UserController.create)
//  .delete(UserController.delete)
//  .get(UserController.findAll);

//routes.route("/users/:user_id").delete(UserController.delete);

//Group
routes.get("/groups", verifyToken, GroupController.findAll);
routes.post("/groups", verifyToken, GroupController.create);

routes.get("/groups/:group_id", verifyToken, GroupController.findOne);
routes.put("/groups/:group_id", verifyToken, GroupController.update);
routes.delete("/groups/:group_id", verifyToken, GroupController.delete);

//Student
routes.get("/students", verifyToken, StudentController.findAll);
routes.post("/students", verifyToken, StudentController.create);

routes.get("/students/:student_id", verifyToken, StudentController.findOne);
routes.put("/students/:student_id", verifyToken, StudentController.update);
routes.delete("/students/:student_id", verifyToken, StudentController.delete);

//Payment
routes.get("/payments", verifyToken, PaymentController.findAll);
routes.post("/payments", verifyToken, PaymentController.create);

routes.get("/payments/:payment_id", verifyToken, PaymentController.findOne);
routes.put("/payments/:payment_id", verifyToken, PaymentController.update);
routes.delete("/payments/:payment_id", verifyToken, PaymentController.delete);

routes.get(
  "/students/payments/:student_id",
  verifyToken,
  PaymentController.findByStudent
);

routes.get("/stats", verifyToken, StatsController.getEarnings);
routes.get("/stats/pending", verifyToken, StatsController.getPendings);

module.exports = routes;
