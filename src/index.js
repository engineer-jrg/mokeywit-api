import Chalk from 'chalk';
import Cors from 'cors';
import Express from 'express';
import Morgan from 'morgan';
import Path from 'path';

import Cofig from '../config/environment/config';

// definiciones
const app = Express();
const port = Cofig.get('port') || 8080;
const projectPath = process.cwd();

// middlewares
app.use(Morgan('tiny'));
app.use(Cors());

// archivos estaticos
app.use(Express.static(Path.join(projectPath, 'public')));

// rutas
app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendfile(Path.join(projectPath, 'public/index.html'));
});
app.use(require('./routes'));
app.use('/api/videos', require('./routes/videos'));

// fuciones para errores
function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found!');
  next(error);
}

function errorHandler(error, req, res) {
  console.log(Chalk.green(error.message));
  res.status(res.statusCode || 500);
  res.json({
    message: error.message,
  });
}

app.use(notFound);
app.use(errorHandler);

// iniciar el servidor
app.listen(port, () => console.log(
  Chalk.green('server on ')
  + Chalk.inverse.blue(`http://localhost:${port}`),
));
