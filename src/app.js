import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";


// import database
import "./dbs/init.mongodb.js";
import { checkOverload } from "./helpers/check.connect.js";

const app = express();

// init middlewares
app.use(morgan("dev")); // should use for development
//app.use(morgan('combined')) // should use for production
app.use(helmet());
app.use(compression());

// init db
checkOverload();

// init routes
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Welcome Review Nodejs!",
  });
});
// handling error

export default app;
