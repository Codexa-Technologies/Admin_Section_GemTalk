const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Answer text is required'],
      trim: true,
      maxlength: 2000,
    },
    answeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
      maxlength: 500,
    },
    askedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answers: [answerSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
