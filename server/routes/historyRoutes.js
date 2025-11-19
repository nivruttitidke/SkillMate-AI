import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  saveHistory,
  getHistory,
  deleteHistoryItem,
  deleteAllHistory
} from "../controllers/historyController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", saveHistory);
// router.post("/add", saveHistory);
router.get("/", getHistory);
router.delete("/:id", deleteHistoryItem);
router.delete("/", deleteAllHistory);

export default router;
