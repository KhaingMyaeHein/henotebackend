const Note = require("../models/note");
const { Msg } = require("../utils/core");

const addNote = (req, res, next) => {
    try{
        const userId = req.user?.id;
        const { department,
             orank,
             oname,
             ohierarchy,
             note } = req.body;
        const phoneNumbers = (req.body.phonenumber || []).map(p => p.phonenumber);
        const newNote = new Note({
            userId,
            department,
            orank,
            oname,
            ohierarchy,
            phonenumber:phoneNumbers,
            note
        });
        newNote.save();
         return Msg(res, "Note added successfully",  {data: {
                _id: newNote._id.toString(),
                userId: newNote.userId,
                department: newNote.department,
                orank: newNote.orank,
                oname: newNote.oname,
                ohierarchy: newNote.ohierarchy,
                note: newNote.note,
                // Map back to array of objects so Android's List<PhoneNumberDto> parses it perfectly
                phonenumber: newNote.phonenumber.map(p => ({ phonenumber: p })),
                createdAt: newNote.createdAt,
                updatedAt: newNote.updatedAt
    }});
    }catch(error){
        next(error);
    }
}
const editNote = async (req, res, next) => {
    try {
        const userId = req.user?.userId || req.user?.id;
        const noteId = req.params.id; 

        const { department, orank, oname, ohierarchy, note } = req.body;
        const phoneNumbers = req.body.phonenumber 
            ? req.body.phonenumber.map(p => p.phonenumber) 
            : undefined;

        const updateData = {
            ...(department !== undefined && { department }),
            ...(orank !== undefined && { orank }),
            ...(oname !== undefined && { oname }),
            ...(ohierarchy !== undefined && { ohierarchy }),
            ...(note !== undefined && { note }),
            ...(phoneNumbers !== undefined && { phonenumber: phoneNumbers })
        };

        const updatedNote = await Note.findOneAndUpdate(
            { _id: noteId, userId: userId }, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ 
                success: false, 
                message: "Note not found or you do not have permission to edit it." 
            });
        }

        // ✅ Return the exact structure Android expects
        return res.status(200).json({
            success: true,
            message: "Note updated successfully",
            result: {
                data: {
                    _id: updatedNote._id.toString(),
                    userId: updatedNote.userId,
                    department: updatedNote.department,
                    orank: updatedNote.orank,
                    oname: updatedNote.oname,
                    ohierarchy: updatedNote.ohierarchy,
                    note: updatedNote.note,
                    phonenumber: updatedNote.phonenumber.map(p => ({ phonenumber: p })),
                    createdAt: updatedNote.createdAt,
                    updatedAt: updatedNote.updatedAt
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

const deleteNote = async (req, res, next) => {
    try {
        // 1. Get the logged-in user's ID and the note ID from the URL
        const userId = req.user?.userId || req.user?.id;
        const noteId = req.params.id; 

        // 2. Find and delete the note, BUT only if it belongs to this user
        const deletedNote = await Note.findOneAndDelete({ 
            _id: noteId, 
            userId: userId 
        });

        // 3. If nothing was deleted, the note doesn't exist or belongs to someone else
        if (!deletedNote) {
            return res.status(404).json({
                success: false,
                message: "Note not found or you do not have permission to delete it."
            });
        }

        // 4. Success response
        return Msg(res, "Note deleted successfully", { noteId: deletedNote._id });

    } catch (error) {
        next(error);
    }
};

const getNote = async (req, res, next) => {
    try {
        // 1. Safely get the userId from the JWT token
        const userId = req.user?.userId || req.user?.id;

        // 2. Fetch all notes for this specific user
        const notes = await Note.find({ userId: userId });

        // 3. Format the notes to EXACTLY match Android's NoteDto structure
        const formattedNotes = notes.map(note => ({
            _id: note._id.toString(),
            userId: note.userId,
            department: note.department,
            orank: note.orank,
            oname: note.oname,
            ohierarchy: note.ohierarchy,
            note: note.note,
            // Convert phone array of strings to array of objects for Android
            phonenumber: (note.phonenumber || []).map(p => ({ phonenumber: p })),
            createdAt: note.createdAt,
            updatedAt: note.updatedAt
        }));

        // 4. Return the exact structure Android expects: result: { data: [...] }
        return res.status(200).json({
            success: true,
            message: "GET SUCCESS",
            result: {
                data: formattedNotes
            }
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    addNote,
    editNote,
    deleteNote,
    getNote
}
