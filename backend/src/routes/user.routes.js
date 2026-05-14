const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const { validate } = require("../middleware/validate");
const { createUserSchema } = require("../validators/schemas");

router.use(authenticate, authorize("ADMIN"));

router.get("/stats", userController.getDashboardStats);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", validate(createUserSchema), userController.createUser);

module.exports = router;
