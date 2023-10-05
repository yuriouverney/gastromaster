const environment = require('./utils/environment');
environment.init();
const path = require('path');

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const controllers = require('./controllers');
const errorHandler = require('./utils/erro-handler');
require('./models');
require('./middlewares/passport');
const passport = require('passport');
const logger = require('./utils/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger');

const app = express();
const port = process.env.PORT || 3000;
app.use('/app/files', express.static(path.resolve(__dirname, '..', 'files')));
app.use('/app/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
  session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.GOOGLE_COOKIE_SECURE }, // Configure 'secure: true' para uso em produção com HTTPS
  })
);

// Inicialize o Passport.js e adicione os middlewares de sessão do Passport.js
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);

app.use('/app', controllers);
app.use(errorHandler);
let server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
module.exports = server;
