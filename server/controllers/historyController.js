import History from "../models/History.js";

//  Save interview result
export const saveHistory = async (req, res) => {
  try {
    const { category, score } = req.body;
    const userId = req.user.id;

    const record = await History.create({
      userId,
      category,
      score,
      date: new Date(),
    });

    res.json({ success: true, record });
  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).json({ success: false, error: "Failed to save" });
  }
};

//  Get full history
export const getHistory = async (req, res) => {
  try {
    const history = await History.find({ userId: req.user.id }).sort({ date: -1 });
    res.json({ history });
  } catch (err) {
    console.error("Fetch history error:", err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

//  Delete ONE history item
export const deleteHistoryItem = async (req, res) => {
  try {
    await History.deleteOne({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Delete item error:", err);
    res.status(500).json({ message: "Failed to delete item" });
  }
};

//  Delete ALL history
export const deleteAllHistory = async (req, res) => {
  try {
    await History.deleteMany({ userId: req.user.id });
    res.json({ message: "All history deleted" });
  } catch (err) {
    console.error("Delete all error:", err);
    res.status(500).json({ message: "Failed to delete history" });
  }
};
