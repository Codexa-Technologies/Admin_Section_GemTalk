const express = require('express');
const mongoose = require('mongoose');
const { createController } = require('../controllers/contentController');
const Article = require('../models/Article');
const News = require('../models/News');
const ResearchPaper = require('../models/ResearchPaper');

const router = express.Router();
const articleCtrl = createController(Article, { hasPdf: true, hasImage: true });
const newsCtrl = createController(News, { hasPdf: false, hasImage: true, imageRequired: true });
const researchCtrl = createController(ResearchPaper, { hasPdf: true, hasImage: true });

const getControllerByType = (type = 'article') => {
	if (type === 'news') return newsCtrl;
	if (type === 'research') return researchCtrl;
	return articleCtrl;
};

router.get('/', (req, res, next) => {
	const type = (req.query.type || 'article').toLowerCase();
	return getControllerByType(type).publicGetAll(req, res, next);
});

router.get('/:id', async (req, res) => {
	try {
		const type = (req.query.type || '').toLowerCase();
		if (type) return getControllerByType(type).publicGetOne(req, res);

		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return res.status(404).json({ success: false, message: 'Not found' });
		}

		const item =
			(await Article.findById(req.params.id).select('-admin -imagePublicId')) ||
			(await News.findById(req.params.id).select('-admin -imagePublicId')) ||
			(await ResearchPaper.findById(req.params.id).select('-admin -imagePublicId'));

		if (!item) return res.status(404).json({ success: false, message: 'Not found' });
		return res.json({ success: true, data: item });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
});

module.exports = router;
