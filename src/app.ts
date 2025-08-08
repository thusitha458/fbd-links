import express, { NextFunction, Request, Response } from "express";

import config from "./config/appConfig";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler";
import path from "path";
import routes from "./routes";
import { sequelize } from "./config/database";

const app = express();
const port = config.port;

app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../src/views"));

app.set("trust proxy", 1);

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.url} not found`,
  });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();
})();