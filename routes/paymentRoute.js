import { initializePayment, VerifyPayment, paymentWebhook } from "../controllers/paymentController.js";
import { authenticate } from "../middleware/auth.middleware.js";

import { Router } from "express";

const router = Router();

router.post("/initialize",authenticate, initializePayment);
router.get("/verify/:reference", authenticate, VerifyPayment)
router.post("/webhook", paymentWebhook)

export default router
