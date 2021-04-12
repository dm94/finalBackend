const express = require("express");
const routes = require("./src/routes/routes");
const app = express();
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const connection = require("./src/connection");
const passport = require("passport");

var corsOption = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: [
    "x-auth-token",
    "content-type",
    "X-Requested-With",
    "Authorization",
    "Accept",
    "Origin",
  ],
};
app.use(passport.initialize());
app.use(cors(corsOption));
app.use(helmet());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(routes);

connection
  .then(() => {
    console.log("Conectado a la base de datos...");

    app.listen(3000, () => {
      console.log("Servidor iniciado");
    });
  })
  .catch(function (err) {
    console.log(`Error al conectar a la base de datos: ${err}`);
  });
