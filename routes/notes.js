const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');
var alert = require('alert');

// ROUTE 1: Get All the Notes using: GET "/api/notes/getuser"
router.get('/fetchallnotes', async (req, res) => {
    const notes = await Note.find();
    res.json(notes);
})

// ROUTE 2: Add a new Note using: POST "/api/notes/addnote"
router.post('/addnote', [
    body('title', 'Enter a valid title').isLength({ min: 1 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 1 }),
    body('interviewee_email').isEmail(),
    body('interviewer_email').isEmail(),
], async (req, res) => {
    try {
        const { title, description, interviewee_email, interviewer_email, presentDate, start_time, end_time } = req.body;
        
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            alert("Please Enter valid credentials! always check -> interviewee_email and interviewer_email should be valid email.");
            return res.status(400).json({});
        }
        ////console.log(req.body);
        const notes = await Note.find();
        ////console.log(notes);
        if (notes) {
            const INTERVALS = [];
            let stime = 0, etime = 0;
            for (let i = 0; i < notes.length; i++) {
                if (notes[i].presentDate === presentDate && (notes[i].interviewee_email === interviewee_email || notes[i].interviewer_email === interviewer_email)) {
                    stime = Number(notes[i].start_time.split(':')[0]) + Number(notes[i].start_time.split(':')[1]) / 60;
                    etime = Number(notes[i].end_time.split(':')[0]) + Number(notes[i].end_time.split(':')[1]) / 60;
                    INTERVALS.push([stime, etime]);
                }
            }
            let curr_stime = Number(start_time.split(':')[0]) + Number(start_time.split(':')[1]) / 60;
            let curr_etime = Number(end_time.split(':')[0]) + Number(end_time.split(':')[1]) / 60;

            console.log(INTERVALS);
            for (let i = 0; i < INTERVALS.length; i++) {
                if (curr_stime >= INTERVALS[i][0] && curr_stime < INTERVALS[i][1] || curr_etime > INTERVALS[i][0] && curr_etime <= INTERVALS[i][1]) {
                    alert("scheduled time is overlapping i.e. interviewee or interviewer is not available.");
                    return res.status(200).json({});
                }
            }
        }

        const note = new Note({
            title, description, interviewee_email, interviewer_email, presentDate, start_time, end_time
        })
        const savedNote = await note.save()
        //console.log(savedNote);
        alert("Interview scheduled successfully without an error");
        res.json(savedNote)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote"
router.put('/updatenote/:id', [
    body('title', 'Enter a valid title').isLength({ min: 1 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 1 }),
    body('interviewee_email').isEmail(),
    body('interviewer_email').isEmail(),
], async (req, res) => {
    const { title, description, interviewee_email, interviewer_email, presentDate, start_time, end_time } = req.body;
    try {
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            alert("Please Enter valid credentials! interviewee_email and interviewer_email should be valid email.");
            return res.status(400).json({});
        }

        // Create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (interviewee_email) { newNote.interviewee_email = interviewee_email };
        if (interviewer_email) { newNote.interviewer_email = interviewer_email };
        if (presentDate) { newNote.presentDate = presentDate };
        if (start_time) { newNote.start_time = start_time };
        if (end_time) { newNote.end_time = end_time };

        const note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote"
router.delete('/deletenote/:id', async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router