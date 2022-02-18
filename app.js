const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// const flash = require('connect-flash');

dotenv.config();
const app = express();

// ========Session================
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});
// ========Import Middleware================
const { bindUserWithRequest } = require('./middleware/authMiddleware');
const setLocals = require('./middleware/setLocals');

// ========Middleware Array==========
const middleware = [
  morgan('dev'),
  express.static('public'),
  express.urlencoded({ extended: true }),
  express.json(),
  session({
    secret: process.env.SECRET_KEY || 'SECRET_KEY',
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
  bindUserWithRequest(),
  setLocals(),
  // flash(),
];
app.use(middleware);
// ========Express json==========

app.use(express.json());
// ========database connection==========
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('dtabase connection successfull');
  })
  .catch((err) => console.log(err));

// ========Import allroute================
const setRoutes = require('./routes/routes');
setRoutes(app);

app.use((req, res, next) => {
  let error = new Error('404 Page Not Found');
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  if (error.status === 404) {
    return res.render('pages/error/404');
  }
  res.render('pages/error/500');
});

// ========set view engine ejs==========
// app.use();
app.set('view engine', 'ejs');

//express  server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server is running successfully at port :${PORT}`);
});
