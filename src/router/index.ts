import { Router } from "express";
import UserController from "../controller/user-controller";
import { body } from "express-validator";
import { authMiddleware } from "../middleware/auth-middleware";


const router = Router();

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 100 }).isString(),
  UserController.registration
);
router.post("/login", UserController.login);
router.post("/logout", UserController.logOut);

router.get("/activate/:link", UserController.activate);
router.get("/refresh", UserController.refresh);
router.get("/users", authMiddleware, UserController.getUsers);

export default router;
