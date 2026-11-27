const User = require("../models/user");
const Note = require("../models/note");

const getAdminStats = async (req, res) => {
    try {
        // 1. Get total counts
        const totalUsers = await User.countDocuments();
        const totalNotes = await Note.countDocuments();

        // 2. Aggregate notes per user (This only returns users who HAVE notes)
        const notesPerUser = await Note.aggregate([
            { $group: { _id: "$userId", noteCount: { $sum: 1 } } }
        ]);

        // 3. ✅ FIX: Get ALL registered users (removed the $in filter)
        const allUsers = await User.find({}).select("_id username email");

        // 4. Combine ALL user details with note counts (defaulting to 0)
        const userStats = allUsers.map(user => {
            // Find if this user has any notes in the aggregated list
            const stat = notesPerUser.find(n => n._id.toString() === user._id.toString());
            
            return {
                userId: user._id.toString(),
                username: user.username,
                email: user.email,
                noteCount: stat ? stat.noteCount : 0 // ✅ Shows 0 if they have no notes
            };
        });

        // 5. Send response
        res.status(200).json({
            success: true,
            result: {
                totalUsers,
                totalNotes,
                userStats
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const getUserNotes = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Find all notes belonging to this specific user
        const notes = await Note.find({ userId: userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            result: {
                data: notes
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAdminStats, getUserNotes }; // Make sure to export it
