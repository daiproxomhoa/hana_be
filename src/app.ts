import * as dotenv from "dotenv";
import express from "express";
import usersRouter from "./routes/users";
import { upload } from "./config/multer";
import { readFile, readFileSync } from "fs";
import http from "http";
import productRouter from "./routes/product";

dotenv.config();
const app = express();

async function main() {
  const PORT: number = parseInt(process.env.PORT as string, 10);
  app.set("port", PORT);
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use("/users", usersRouter);
  app.use("/products", productRouter);

  app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
  });
  app.post("/upload", upload.single("file"), (req, res, next) => {
    const file = req.file;
    if (!file) {
      return res.json({
        error: [{ message: "Please upload a file" }],
      });
    }
    res.json({ url: file.filename });
  });

  app.get("/upload/:path", (req, res, next) => {
    try {
      const data = readFileSync(`public/images/${req.params.path}`);
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      res.write(data);
      res.end();
    } catch (err) {
      console.error(err);
    }
  });

  app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
  });

  module.exports = app;
}
main();
