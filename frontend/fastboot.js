// const fastbootMiddleware = require('fastboot-express-middleware'),
//       express = require('express'),
//       morgan = require('morgan'),
//       compress = require('compression');
//
// let portArgv = process.argv.find((arg) => arg.match('PORT')),
//     port = portArgv ? portArgv.replace('PORT=', '') : 5000;
//
// let app = express();
//
//
// app.use(compress());
// app.use(morgan('[:date[clf]] ":method :url HTTP/:http-version" :status :response-time ms :remote-addr - :remote-user :res[content-length] ":referrer" ":user-agent"'));
// app.use(express.static('dist', { maxAge: '1y' }));
//
// app.get('/*', fastbootMiddleware({ distPath: 'dist' }));
//
// app.listen(port, () => {
//   console.log(`FastBoot running at http://localhost:${port}`);
// });
