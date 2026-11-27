const express = require("express");
const router = express.Router();
const { getAdminStats,
    getUserNotes
 } = require("../controllers/adminController");
// Note: Add your admin authentication middleware here in a real app
router.get("/stats", getAdminStats); 
router.get("/users/:userId/notes", getUserNotes);
module.exports = router;