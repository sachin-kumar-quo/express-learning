const express = require('express');

const router = express.Router();

module.exports = (params) => {
  const { speakerService } = params;
  router.get('/', async (req, res, next) => {
    try {
      const speakers = await speakerService.getList();
      const artwork = await speakerService.getAllArtwork();
      return res.render('layout', {
        pageTitle: 'Speakers',
        template: 'speakers',
        speakers,
        artwork,
      });
    } catch (error) {
      return next(error);
    }
  });

  router.get('/:shortname', async (req, res, next) => {
    try {
      const speaker = await speakerService.getSpeaker(req.params.shortname);
      const artwork = await speakerService.getArtworkForSpeaker(
        req.params.shortname
      );
      return res.render('layout', {
        pageTitle: 'Speakers',
        template: 'speakers-detail',
        speaker,
        artwork,
      });
    } catch (error) {
      return next(error);
    }
  });
  return router;
};
