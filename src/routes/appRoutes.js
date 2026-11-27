const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controllers/adminController");
// Note: Add your admin authentication middleware here in a real app
router.get("/stats", getAdminStats); 
module.exports = router;