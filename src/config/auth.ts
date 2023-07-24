import { verify } from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  const token = bearerHeader?.split(" ")[1];

  if (token) {
    verify(token, process.env.SECRET_KEY || "", (err, authData) => {
      if (authData) {
        req.userData = authData;
        next();
      } else {
        res.sendStatus(401);
      }
    });
  } else {
    res.sendStatus(401);
  }
};

export default verifyToken;
