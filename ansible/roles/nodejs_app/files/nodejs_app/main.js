import express from 'express';
import { join } from 'path';
import eformidable from 'express-formidable';
import {
  existsSync, mkdirSync,
} from 'fs';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
// monitoring
import PromExporter from '@tailorbrands/node-exporter-prometheus';
import Logstash from 'logstash-client';

import adminFormRoute from './routes/adminForm.js';
import szervezokApi from './api/szervezok.js';
import rendezvenyekApi from './api/rendezvenyek.js';
import reszfeladatokApi from './api/reszfeladatok.js';
import indexRoute from './routes/index.js';
import authentificationRoute from './auth/authentification.js';
import rendezvenyReszletesRoute from './routes/rendezvenyReszletes.js';
import adminSzervezoAdatokRoute from './routes/adminSzervezoAdatok.js';
import reszfeladatLetrehozRoute from './routes/reszfeladatLetrehozas.js';
import reszfeladatokAdminRoute from './routes/reszfeladatokAdmin.js';
import reszfeladatokSzervezoRoute from './routes/reszfeladatokSzervezo.js';
import reszfeladatokNaploRoute from './routes/reszfeladatokNaplo.js';
import {
  createTableFelhasznalo, createTableFenykep, createTableRendezveny,
  createTableSzervezo, createTableReszfeladatok, createTableReszfeladatokNaplo,
} from './db/connection_db.js';
import { insertAdmin } from './db/rendezvenyek_db.js';
import { addJwtCookie, authorize } from './auth/authMiddlewares.js';

// mappa amit elerhetove tesz
const staticDirectory = join(process.cwd(), 'static');

const app = express();
const uploadDir = join(staticDirectory, 'feltolt');
const viewsDir = join(process.cwd(), 'views');

if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}

// ejs beallitasa sablonmotornak
app.set('view engine', 'ejs');
app.set('views', viewsDir);

app.use(express.static(staticDirectory));

app.use(eformidable({ uploadDir }));

// json formatum feldolgozasa ha abban van a keres
app.use(bodyParser.json());

app.use(cookieParser());

// sajat cookie middleware
app.use(addJwtCookie);

// monitoring
const promExporter = PromExporter({ appName: 'node', collectDefaultMetrics: true });
app.use(promExporter.middleware);
app.get('/metrics', promExporter.metrics);

// loggolas
// common - Standard Apache common log output.

const loggingFormat = ':remote-addr [:date[iso]] :method :url :status :res[content-length] bytes :response-time ms';

const logstash = new Logstash({
  type: 'tcp',
  host: 'localhost',
  port: 5701,
});

// app.use(morgan('common', {
//   stream: createWriteStream('./logs/node-logger.log', { flags: 'a' }),
// }));

const loggerstream = {
  write(message) {
    console.log(message);
    logstash.send(message);
  },
};

app.use(morgan(loggingFormat, { stream: loggerstream }));

// app.use(morgan(loggingFormat));

app.use('/admin_form', authorize(['admin']),  adminFormRoute);

app.use('/api/szervezok', szervezokApi);

app.use('/api/rendezvenyek', rendezvenyekApi);

app.use('/api/reszfeladatok', reszfeladatokApi);

app.use('/rendezveny_reszletes', rendezvenyReszletesRoute);

app.use('/admin_szervezo_adatok', authorize(['admin']), adminSzervezoAdatokRoute);

app.use('/reszfeladat_letrehozas', authorize(['admin']), reszfeladatLetrehozRoute);

app.use('/reszfeladatok/admin', authorize(['admin']), reszfeladatokAdminRoute);

app.use('/reszfeladatok/szervezo', authorize(), reszfeladatokSzervezoRoute);

app.use('/reszfeladatNaplobejegyzesek', authorize(), reszfeladatokNaploRoute);

app.use(['/', '/index', '/index.html'], indexRoute);

app.use('/auth', authentificationRoute);

const ipAddress = '0.0.0.0'; // or your server's public IP address

// tablak letrehozasa
createTableRendezveny()
  .then(createTableFelhasznalo)
  .then(createTableSzervezo)
  .then(createTableFenykep)
  .then(createTableReszfeladatok)
  .then(createTableReszfeladatokNaplo)
  .then(insertAdmin)  // letrehoz egy admin felhasznalot ha meg nem letezik
  .then(() => {
    app.listen(2000, ipAddress, () => { console.log(`Server listening on http://${ipAddress}:2000/ ...`); });
  })
  .catch((err) => {
    console.log(err);
  });
