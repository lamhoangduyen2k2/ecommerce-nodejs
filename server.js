import dotenv from "dotenv";
import app from "./src/app.js";

// Load variables in .env to process.env
dotenv.config();

const PORT = process.env.PORT || 3056;

const server = app.listen(PORT, () => {
  console.log(`WSV eCommerce start with port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exit Server Express"));
  // notify.send(ping...)
});
