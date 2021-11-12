const express = require('express');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const path = require('path');
const routes = require('./routes');

const FeedbackService = require('./services/FeedbackService');
const SpeakerService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakerService = new SpeakerService('./data/speakers.json');

const app = express();
const PORT = 3000;

app.set('trust proxy', 1);
app.use(
  cookieSession({
    name: 'session',
    keys: ['asdfasfasfasfasasd', 'asdfasfadsfd'],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.locals.siteName = 'sachin kumar';

app.use(express.static(path.join(__dirname, './static')));

app.use(async (req, res, next) => {
  try {
    const names = await speakerService.getNames();
    res.locals.speakerNames = names;
    return next();
  } catch (err) {
    return next(err);
  }
});
app.use('/', routes({ feedbackService, speakerService }));

app.use((req, res, next) => next(createError(404, 'file not found')));

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.status = err.status || 500;
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
