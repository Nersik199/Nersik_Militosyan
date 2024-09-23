import path from 'path';
import logger from 'morgan';
import express from 'express';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import corsMiddleware from './middleware/cors.js';

// import cors from 'cors';

import indexRouter from './routes/index.js';
const app = express();

// view engine setup
app.set('views', path.resolve('./views'));
app.set('view engine', 'ejs');

app.use(corsMiddleware);
app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.resolve('./public')));

app.use('/', indexRouter);

app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

export default app;
