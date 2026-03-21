const express = require('express');
const {
	getQuestions,
	createQuestion,
	addAnswer,
	deleteAnswer,
	deleteQuestion,
	getQuestionsAdmin,
	deleteQuestionAdmin,
} = require('../controllers/questionController');
const { protectUser } = require('../middlewares/userAuth');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getQuestions);
router.post('/', protectUser, createQuestion);
router.post('/:id/answers', protectUser, addAnswer);
router.delete('/:id/answers/:answerId', protectUser, deleteAnswer);
router.delete('/:id', protectUser, deleteQuestion);
router.get('/admin', protect, getQuestionsAdmin);
router.delete('/admin/:id', protect, deleteQuestionAdmin);

module.exports = router;
