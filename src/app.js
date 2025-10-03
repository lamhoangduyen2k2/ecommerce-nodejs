import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import router from "./routes/index.js";

// import database
import "./dbs/init.mongodb.js";
import { checkOverload } from "./helpers/check.connect.js";

const app = express();

// init middlewares
app.use(morgan("dev")); // should use for development
//app.use(morgan('combined')) // should use for production
app.use(helmet());
app.use(compression());
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// init db
checkOverload();

// init routes
app.use("/", router);
// handling error

export default app;
