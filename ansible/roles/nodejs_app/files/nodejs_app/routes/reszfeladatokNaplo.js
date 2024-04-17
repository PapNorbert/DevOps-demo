import express from 'express';
import {
  selectReszfeladatNaplobejegyzesek, selectRendezvenyById, checkSzervezoE,
} from '../db/rendezvenyek_db.js';

const router = express.Router();

router.get('/:rendID', async (request, response) => {
  try {
    const rendId = parseInt(request.params.rendID, 10);
    const szervezo = await checkSzervezoE(response.locals.payload.felhasznaloName, rendId);
    if (szervezo) {
      const rendezveny = await selectRendezvenyById(rendId);
      const naplobejegyzesek = await selectReszfeladatNaplobejegyzesek(rendId);
      response.render('naplobejegyzesek', { naplobejegyzesek, rendezveny });
    } else {
      response.status(401);
      response.render('permission_error', { uzenet: 'Nem megfelelő jogok az oldal eléréséhez' });
    }
  } catch (err) {
    response.status(400);
    response.render('error', { error: err });
  }
});

export default router;
