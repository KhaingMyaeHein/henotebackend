const express = require("express");
const router = express.Router();
const {authmiddleware} = require("../middleware/jwt_config");
const {
    addNote,
    editNote,
    deleteNote,
    getNote
}= require("../controllers/noteController");
// add Note
router.post("/function",authmiddleware,addNote);
router.put("/function/:id",authmiddleware,editNote);
router.delete("/function/:id",authmiddleware,deleteNote);
router.get("/function",authmiddleware,getNote);
module.exports = router;