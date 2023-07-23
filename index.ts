import { config } from "dotenv";
import express from "express";
import usersRouter from "./routes/users";

if (!process.env.PORT) {
  process.exit(1);
}
config();

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json());

const port = process.env.PORT;

app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
