const router = require("express").Router();
const storeController = require("../controllers/store.controller");
const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const { validate } = require("../middleware/validate");
const { createStoreSchema, updateStoreSchema } = require("../validators/schemas");

// Static routes MUST come before /:id to avoid 'owner' being matched as an id
router.get("/owner/dashboard", authenticate, authorize("STORE_OWNER"), storeController.getOwnerDashboard);
router.get("/", authenticate, storeController.getAllStores);
router.get("/:id", authenticate, storeController.getStoreById);

// Admin only
router.post("/", authenticate, authorize("ADMIN"), validate(createStoreSchema), storeController.createStore);
router.put("/:id", authenticate, authorize("ADMIN"), validate(updateStoreSchema), storeController.updateStore);
router.delete("/:id", authenticate, authorize("ADMIN"), storeController.deleteStore);

module.exports = router;
