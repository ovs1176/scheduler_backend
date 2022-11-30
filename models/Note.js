const { timestampFormat } = require('concurrently/src/defaults');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    interviewee_email:{
        type: String,
        required: true,
    },
    interviewer_email:{
        type: String,
        required: true,
    },
    presentDate:{
        type: String,
    },
    start_time: {
        type: String,
    },
    end_time: {
        type: String,
    },
  });

  module.exports = mongoose.model('notes', NotesSchema);