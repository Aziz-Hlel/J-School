// import path from "node:path";

// import dotenv from "dotenv";
// import { defineConfig, env } from "prisma/config";

// dotenv.config({
//   path: "../../apps/server/.env",
// });

// export default defineConfig({
//   schema: path.join("prisma", "schema"),
//   migrations: {
//     path: path.join("prisma", "migrations"),
//   },
//   datasource: {
//     url: env("DATABASE_URL"),
//   },
// });

import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const DATABASE_URL = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
console.log(DATABASE_URL);
export default defineConfig({
  schema: 'prisma/',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: DATABASE_URL,
  },
});
