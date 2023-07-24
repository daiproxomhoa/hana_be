import { validationResult } from "express-validator";

export const showMessage = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array().map((v) => ({
        type: v.type,
        message: v.msg,
      })),
    });
  } else {
    next();
  }
};
