import express from 'express';
import {
  selectAllRendezveny, selectAllFelhasznaloName, insertReszfeladat,
  selectFelhasznaloID, insertReszfeladatokNaplo, selectReszfeladatId,
} from '../db/rendezvenyek_db.js';

const router = express.Router();

function checkPostData(reszfeladatNev, hatarido) {
  return (reszfeladatNev !== '' && reszfeladatNev !== undefined && hatarido !== '' && hatarido !== undefined);
}

router.post('', async (request, response) => {
  try {
    const rendezvenyID = request.fields['rendezveny-id'];
    const reszfNev = request.fields['reszfeladat-nev'];
    const szervNev = request.fields['szervezo-nev'];
    const hatarido = new Date(request.fields['reszfeladat-hatarido']);

    const parameterek = {
      rendID: rendezvenyID,
      reszfeladatNev: reszfNev,
      hatarido: request.fields['reszfeladat-hatarido'],
      kivalasztottSzervezo: szervNev,
    };

    const naplobejegyzes = {
      leiras: 'Részfeladat létrehozása',
      ujErtek: '',
      regiErtek: '',
    };

    if (checkPostData(reszfNev, request.fields['reszfeladat-hatarido'])) {
      if (szervNev !== '' && szervNev !== undefined) {
        const szervID = await selectFelhasznaloID(szervNev);
        await insertReszfeladat(rendezvenyID, reszfNev, hatarido, szervID);
        naplobejegyzes.ujErtek = `szervező neve: ${szervNev}`;
        naplobejegyzes.reszfeladatId = await selectReszfeladatId(rendezvenyID, reszfNev, hatarido);
        await insertReszfeladatokNaplo(naplobejegyzes);
      } else {
        await insertReszfeladat(rendezvenyID, reszfNev, hatarido);
        naplobejegyzes.reszfeladatId = await selectReszfeladatId(rendezvenyID, reszfNev, hatarido);
        await insertReszfeladatokNaplo(naplobejegyzes);
      }
      response.render('reszfeladatokSikeres', { rendezvenyID, reszfNev, hatarido });
    } else {
      parameterek.hiba = 'Toltson ki minden adatot';
      parameterek.rendezvenyLista = await selectAllRendezveny();
      parameterek.felhasznaloLista = await selectAllFelhasznaloName();
      response.render('reszfeladat_form', { alapErtekek: parameterek });
    }
  } catch (err) {
    response.status(400);
    response.render('error', { error: err });
  }
});

router.get('', async (request, response) => {
  try {
    const parameterek = {
      rendID: undefined,
      reszfeladatNev: undefined,
      hatarido: undefined,
      kivalasztottSzervezo: undefined,
    };
    parameterek.rendezvenyLista = await selectAllRendezveny();
    parameterek.felhasznaloLista = await selectAllFelhasznaloName();
    response.render('reszfeladat_form', { alapErtekek: parameterek });
  } catch (err) {
    response.status(400);
    response.render('error', { error: err });
  }
});

export default router;
