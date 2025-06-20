import express from "express";

const router = express.Router();

/**
 * GET /api/debug-user
 * Debug endpoint to check user data directly
 */
router.get("/debug-user", async (req, res) => {
  try {
    const { uid } = req.query;

    if (!uid) {
      return res.status(400).json({ error: "User ID (uid) is required" });
    }

    console.log(`Debug endpoint called for user: ${uid}`);

    try {
      // Dynamic import to avoid circular dependencies
      const { getUserByUid } = await import("../firebase-utils.js");

      // Get user data directly
      const user = await getUserByUid(uid);
      console.log("User data from Firestore:", user);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Return user data with friends
      res.json({
        user,
        hasFriends: Boolean(user.friends && user.friends.length > 0),
        friendsCount: user.friends ? user.friends.length : 0,
        friends: user.friends || [],
      });
    } catch (error) {
      console.error("Error in debug endpoint:", error);
      res
        .status(500)
        .json({ error: "Error fetching user data", details: error.toString() });
    }
  } catch (error) {
    console.error("Unexpected error in debug endpoint:", error);
    res
      .status(500)
      .json({ error: "Unexpected error", details: error.toString() });
  }
});

export default router;
