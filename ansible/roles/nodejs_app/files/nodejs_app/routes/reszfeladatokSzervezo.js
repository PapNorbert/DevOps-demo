import express from 'express';
import {
  selectRendezvenyById, selectReszfeladatByRendezvenyId, selectReszfeladatByRendezvenyIdAndSzervezo,
  checkSzervezoE,
} from '../db/rendezvenyek_db.js';

const router = express.Router();

router.get('/:rendID/:szervezoNev', async (request, response) => {
  try {
    const rendezvenyId = parseInt(request.params.rendID, 10);
    const szervezoNeve = request.params.szervezoNev;

    const szervezo = await checkSzervezoE(response.locals.payload.felhasznaloName, rendezvenyId);
    if (!szervezo) {
      response.status(401);
      response.render('permission_error', { uzenet: 'Nem megfelelő jogok az oldal eléréséhez' });
      return;
    }

    if (szervezoNeve !== response.locals.payload.felhasznaloName) {
      response.status(401);
      response.render('permission_error', { uzenet: 'Nem megfelelő jogok az oldal eléréséhez' });
      return;
    }

    const rendezveny = await selectRendezvenyById(rendezvenyId);
    const reszfeladatok = await
    selectReszfeladatByRendezvenyIdAndSzervezo(rendezvenyId, szervezoNeve);

    response.render('reszfeladatokSzervezo', {
      rendezveny, reszfeladatok,
    });
  } catch (err) {
    response.status(400);
    response.render('error', { error: err });
  }
});

router.get('/:rendID', async (request, response) => {
  try {
    const rendezvenyId = parseInt(request.params.rendID, 10);

    const szervezo = await checkSzervezoE(response.locals.payload.felhasznaloName, rendezvenyId);
    if (!szervezo) {
      response.status(401);
      response.render('permission_error', { uzenet: 'Nem megfelelő jogok az oldal eléréséhez' });
      return;
    }

    const rendezveny = await selectRendezvenyById(rendezvenyId);
    const reszfeladatok = await selectReszfeladatByRendezvenyId(rendezvenyId);
    response.render('reszfeladatokSzervezo', {
      rendezveny, reszfeladatok,
    });
  } catch (err) {
    response.status(400);
    response.render('error', { error: err });
  }
});

export default router;
