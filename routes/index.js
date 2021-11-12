const express = require('express');

const speakerRoutes = require('./speakers');
const feedbackRoutes = require('./feedback');

const router = express.Router();

module.exports = (params) => {
  const { speakerService } = params;
  router.get('/', async (req, res, next) => {
    try {
      const artwork = await speakerService.getAllArtwork();
      const topSpeakers = await speakerService.getList();
      return res.render('layout', {
        pageTitle: 'Welcome',
        template: 'index',
        topSpeakers,
        artwork,
      });
    } catch (error) {
      return next(error);
    }
  });
  router.use('/speakers', speakerRoutes(params));
  router.use('/feedback', feedbackRoutes(params));
  return router;
};
