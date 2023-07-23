import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import { check, checkSchema } from "express-validator";
import { sign, verify } from "jsonwebtoken";
import verifyToken from "../config/auth";
import { pg } from "../config/database";
import { showMessage } from "../config/validate";
import { userController } from "../controllers/UserController";

const usersRouter = Router();
/* GET users listing. */
usersRouter.post("/post", verifyToken, function (req: any, res) {
  verify(req.token, "secretkey", (err: any, authData: any) => {
    res.json({ data: "ok", err, authData });
  });
});

usersRouter.post(
  "/login",
  [check("password").isLength({ min: 5 }).withMessage("Ít nhất 5 ký t")],
  showMessage,
  async function (req: Request, res: Response) {
    const user = req.body;
    const data = await pg.query({
      text: "SELECT * FROM auth.account where account.username=$1",
      values: [user.username],
    });
    if (data.rowCount) {
      const tmp = data.rows?.[0];
      const match = bcrypt.compareSync(user.password, tmp.password);
      if (match) {
        res.json({
          data: tmp,
          token: sign(tmp, "secretkey"),
        });
      } else {
        res.json({
          message: "sai pass",
        });
      }
    } else {
      res.json({
        message: "sai username",
      });
    }
  }
);

usersRouter.post(
  "/signup",
  // checkSchema({
  //   user_password: {
  //     isLength: { options: { min: 5 }, errorMessage: "Ít nhất 5 ký tự" },
  //   },
  //   user_name: {
  //     isLength: { options: { min: 5 }, errorMessage: "Ít nhất 5 ký tự" },
  //     optional: {
  //       options: { nullable: false },
  //     },
  //   },
  // }),
  // showMessage,
  userController.signup
);
usersRouter.post("/", (request, response) => {
  console.log(request.body); // your JSON
  response.send(request.body); // echo the result back
});

usersRouter.get("/get/:id", verifyToken, async (req, res) => {
  const data = await userController.get(req.params.id);
  if (data.rowCount) {
    res.status(200).json(data.rows[0]);
  }
  res.status(400).json({ message: "empty" });
});

export default usersRouter;
