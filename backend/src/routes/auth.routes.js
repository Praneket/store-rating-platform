const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { signupSchema, loginSchema, updatePasswordSchema } = require("../validators/schemas");

router.post("/signup", validate(signupSchema), authController.signup);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.getMe);
router.put("/password", authenticate, validate(updatePasswordSchema), authController.updatePassword);

module.exports = router;
