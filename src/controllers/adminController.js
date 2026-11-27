const User = require("../models/user");
const Note = require("../models/note");

const getAdminStats = async (req, res) => {
    try {
        // 1. Get total counts
        const totalUsers = await User.countDocuments();
        const totalNotes = await Note.countDocuments();

        // 2. Aggregate notes per user
        const notesPerUser = await Note.aggregate([
            { $group: { _id: "$userId", noteCount: { $sum: 1 } } }
        ]);

        // 3. Get user details for those who have notes
        const userIds = notesPerUser.map(item => item._id);
        const users = await User.find({ _id: { $in: userIds } }).select("_id username email");

        // 4. Combine user details with note counts
        const userStats = users.map(user => {
            const stat = notesPerUser.find(n => n._id.toString() === user._id.toString());
            return {
                userId: user._id.toString(),
                username: user.username,
                email: user.email,
                noteCount: stat ? stat.noteCount : 0
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

module.exports = { getAdminStats };