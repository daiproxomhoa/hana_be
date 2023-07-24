import { Router } from "express";
import { checkSchema } from "express-validator";
import { showMessage } from "../config/validate";
import verifyToken from "../config/auth";
import { productController } from "../controllers/ProductController";

const productRouter = Router();

productRouter.get("/", verifyToken, productController.getList);
productRouter.post("/", verifyToken, productController.create);
productRouter.put("/", verifyToken, productController.update);
productRouter.delete("/:id", verifyToken, productController.delete);

export default productRouter;
