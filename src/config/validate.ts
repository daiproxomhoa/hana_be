import { validationResult } from "express-validator";

export const showMessage = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array().map((v) => v.msg) });
  } else {
    next();
  }
};
