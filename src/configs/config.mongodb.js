"use strict";

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3000,
  },
  db: {
    username: process.env.DEV_DB_USERNAME || "duyen0289",
    pass: process.env.DEV_DB_PASS || "duyen0289",
    cluster: process.env.DEV_DB_CLUSTER || "duyencluster.umn5a.mongodb.net",
    name: process.env.DEV_DB_NAME || "shopDEV",
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_USERNAME || 3000,
  },
  db: {
    username: process.env.PRO_DB_USERNAME || "duyen0289",
    pass: process.env.PRO_DB_PASS || "duyen0289",
    cluster: process.env.PRO_DB_CLUSTER || "@duyencluster.umn5a.mongodb.net",
    name: process.env.PRO_DB_NAME || "shopDEV",
  },
};

const config = { dev, pro };
const env = process.env.NODE_DEV || "dev";

export default config[env];
