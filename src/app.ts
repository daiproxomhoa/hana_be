import * as dotenv from "dotenv";
import express from "express";
import usersRouter from "./routes/users";
const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  console.log("PORT", PORT);
  res.send("Express + TypeScript Server");
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
