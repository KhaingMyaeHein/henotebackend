const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({ // Added 'new' keyword (best practice)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true // FIXED: was 'require'
    },
    department: {
        type: String,
        trim: true // Recommended: removes accidental whitespace
    },
    orank: {
        type: String,
        required: true, // FIXED: was 'require'
        trim: true
    },
    oname: {
        type: String,
        required: true, // FIXED: was 'require'
        trim: true
    },
    ohierarchy: {
        type: String,
        required: true, // FIXED: was 'require: ture'
        default: "HE",
        trim: true
    },
    phonenumber: [{
        type: String,
        trim: true
    }],
    note: {
        type: String,
        trim: true
    }
}, { timestamps: true });

// Excellent: Indexing userId will make queries for a specific user's notes much faster
noteSchema.index({ userId: 1 });

module.exports = mongoose.model("Note", noteSchema);