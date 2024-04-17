import express from 'express';
import {
  selectAllRendezveny, selectRendezvenyByFelhasznaloName,
} from '../db/rendezvenyek_db.js';

const router = express.Router();

router.get('', async (request, response) => {
  try {
    const rendezvenyek = await selectAllRendezveny();
    // kirajzoljuk a requests sablont - a model az query eredménye

    response.render('index', {
      rendezvenyek,
      felhasznaloNeve: undefined,
      szervezoGombSzoveg: 'Csatlakozas',
      nincsRendezvenySzoveg: 'Nincsenek létrehozott rendezvények',
    });
  } catch (err) {
    response.status(400);
    response.render('error', { error: err });
  }
});

router.get('/rendezvenyek/:szervezoName', async (request, response) => {
  try {
    if (request.params.szervezoName !== response.locals.payload.felhasznaloName) {
      response.status(401);
      response.render('permission_error', { uzenet: 'Nem megfelelő jogok az oldal eléréséhez' });
      return;
    }

    const rendezvenyek = await selectRendezvenyByFelhasznaloName(request.params.szervezoName);

    response.render('index', {
      rendezvenyek,
      felhasznaloNeve: undefined,
      szervezoGombSzoveg: 'Visszalepes',
      nincsRendezvenySzoveg: 'Nincsenek rendezvények, amihez csatlakozott',
    });
  } catch (err) {
    response.status(400);
    response.render('error', { error: err });
  }
});

export default router;
