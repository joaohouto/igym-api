const express = require("express");
const cors = require("cors");

require("./config/database");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(routes);

app.listen(port, () => console.log("[dev] 🔥 Server running on port " + port));
