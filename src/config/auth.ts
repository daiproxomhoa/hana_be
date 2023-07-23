import { verify } from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    req.token = bearerHeader;
    verify(req.token, "secretkey", (err, authData) => {
      if (authData) {
        req.userData = authData;
        next();
      } else {
        res.sendStatus(403);
      }
    });
  } else {
    res.sendStatus(403);
  }
};

export default verifyToken;
