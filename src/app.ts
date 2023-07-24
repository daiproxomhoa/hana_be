import * as dotenv from "dotenv";
import express from "express";
import usersRouter from "./routes/users";
dotenv.config();
const app = express();

async function main() {
  const PORT: number = parseInt(process.env.PORT as string, 10);
  app.set("port", PORT);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use("/users", usersRouter);

  app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
  });

  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });
}
main();
