const router = require("express").Router();
const ratingController = require("../controllers/rating.controller");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const { validate } = require("../middleware/validate");
const { ratingSchema } = require("../validators/schemas");

router.use(authenticate, authorize("USER"));

router.post("/", validate(ratingSchema), ratingController.submitRating);
router.get("/my", ratingController.getMyRatings);

module.exports = router;
