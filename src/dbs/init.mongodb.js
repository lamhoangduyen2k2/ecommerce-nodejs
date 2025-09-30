"use strict";
import mongoose from "mongoose";
import { countConnect } from "../helpers/check.connect.js";
import config from "../configs/config.mongodb.js";
const {
  db: { username, pass, cluster, name },
} = config;

const connectString = `mongodb+srv://${username}:${pass}@${cluster}/${name}`;

class Database {
  constructor() {
    this.connect();
  }

  connect = (type = "mongodb") => {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString, { maxPoolSize: 50 })
      .then((_) => console.info("Connected Mongodb Success", countConnect()))
      .catch((err) => console.error("Error Connect!"));
  };

  static getInstance = () => {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  };
}

const instanceMongodb = Database.getInstance();
export default instanceMongodb;
