import express from "express";
import { startInterview, chatAI,upgradeAnswers} from "../controllers/chatController.js";
import { translateText } from "../controllers/translateController.js";
const router = express.Router();

// Generate Questions
router.post("/start", startInterview);

// Chat (messages)
router.post("/", chatAI);
router.post("/upgrade-answers", upgradeAnswers);
router.post("/translate", translateText);
export default router;
