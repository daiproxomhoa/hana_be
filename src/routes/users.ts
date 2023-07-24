import { Router } from "express";
import { checkSchema } from "express-validator";
import { showMessage } from "../config/validate";
import { userController } from "../controllers/UserController";
import verifyToken from "../config/auth";

const usersRouter = Router();

usersRouter.delete("/:userId", verifyToken, userController.delete);
usersRouter.post(
  "/login",
  checkSchema({
    user_password: {
      isLength: { options: { min: 5 }, errorMessage: "Ít nhất 5 ký tự" },
    },
    user_name: {
      isLength: { options: { min: 5 }, errorMessage: "Ít nhất 5 ký tự" },
      optional: {
        options: { nullable: false },
      },
    },
  }),
  showMessage,
  userController.login
);

usersRouter.post(
  "/signup",
  checkSchema({
    user_password: {
      isLength: { options: { min: 5 }, errorMessage: "Ít nhất 5 ký tự" },
    },
    user_name: {
      isLength: { options: { min: 5 }, errorMessage: "Ít nhất 5 ký tự" },
      optional: {
        options: { nullable: false },
      },
    },
  }),
  showMessage,
  userController.signup
);

export default usersRouter;
