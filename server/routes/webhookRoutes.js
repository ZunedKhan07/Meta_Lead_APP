import express from "express";
import { handleIncomingLead, verifyWebhook } from "../controllers/leadController.js";

const router = express.Router();

router.get('/', verifyWebhook);

router.post('/', handleIncomingLead);

export default router;