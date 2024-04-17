import express from 'express';
import {
  selectAllRendezveny, selectAllFelhasznaloName,
} from '../db/rendezvenyek_db.js';

const router = express.Router();

router.get('', async (request, response) => {
  try {
    const parameterek = {
      rendID: undefined,
      kivalasztottSzervezo: undefined,
    };
    parameterek.rendezvenyLista = await selectAllRendezveny();
    parameterek.felhasznaloLista = await selectAllFelhasznaloName();
    response.render('admin_szervezo_adatok', { alapErtekek: parameterek });
  } catch (err) {
    response.status(400);
    response.render('error', { error: err });
  }
});

export default router;
