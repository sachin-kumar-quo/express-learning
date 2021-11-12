const express = require('express');

const { check, validationResult } = require('express-validator');

const router = express.Router();

const validations = [
  check('name')
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage('Name must be at least 2 characters long'),
  check('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('A Valid email is required'),
  check('title')
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage('title must be at least 2 characters long'),
  check('message')
    .trim()
    .isLength({ min: 5 })
    .escape()
    .withMessage('Message must be at least 5 characters long'),
];

module.exports = (params) => {
  const { feedbackService } = params;

  router.get('/', async (req, res, next) => {
    try {
      const feedbacks = await feedbackService.getList();

      const errors = req.session.feedback ? req.session.feedback.errors : false;
      const successMessage = req.session.feedback
        ? req.session.feedback.message
        : false;
      req.session.feedback = {};
      return res.render('layout', {
        pageTitle: 'FeedBack',
        template: 'feedback',
        feedbacks,
        errors,
        successMessage,
      });
    } catch (error) {
      return next(error);
    }
  });
  router.post('/', validations, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.session.feedback = {
          errors: errors.array(),
        };
        return res.redirect('/feedback');
      }
      const { name, email, title, message } = req.body;
      await feedbackService.addEntry(name, email, title, message);
      req.session.feedback = {
        message: 'Thank you for your feedback',
      };
      return res.redirect('/feedback');
    } catch (error) {
      return next(error);
    }
  });

  router.post('/api', validations, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.array(),
        });
      }
      const { name, email, title, message } = req.body;
      await feedbackService.addEntry(name, email, title, message);
      const feedbacks = await feedbackService.getList();
      return res.status(200).json({
        feedbacks,
        successMessage: 'Thank you for your feedback',
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
