import express from 'express';
import {
  selectAllReszfeladat, selectAllFelhasznaloName, selectReszfeladatByRendezvenyId,
  selectAllRendezveny, selectReszfeladatByRendezvenyIdAndElvegezve,
  selectReszfeladatByRendezvenyIdAndKesoi,
} from '../db/rendezvenyek_db.js';

const router = express.Router();

router.get('/:rendID/:szurofeltetel', async (request, response) => {
  try {
    const rendId = parseInt(request.params.rendID, 10);
    const { szurofeltetel } = request.params;
    let reszfeladatok = {};
    let szuroSzoveg = '';
    let nincsReszfeladatSzoveg = 'Nincs létrehozott részfeladatok a kiválasztott rendezvényen';
    if (szurofeltetel === 'all') {
      reszfeladatok = await selectReszfeladatByRendezvenyId(rendId);
    } else if (szurofeltetel === 'megoldott') {
      reszfeladatok = await selectReszfeladatByRendezvenyIdAndElvegezve(rendId, 1);
      szuroSzoveg = 'Megoldott részfeladatok:';
      nincsReszfeladatSzoveg = 'Nincsenek megoldott részfeladatok a kiválasztott rendezvényen';
    } else if (szurofeltetel === 'megoldatlan') {
      reszfeladatok = await selectReszfeladatByRendezvenyIdAndElvegezve(rendId, 0);
      szuroSzoveg = 'Megoldatlan részfeladatok:';
      nincsReszfeladatSzoveg = 'Nincsenek megoldatlan részfeladatok a kiválasztott rendezvényen';
    } else if (szurofeltetel === 'kesoi') {
      reszfeladatok = await selectReszfeladatByRendezvenyIdAndKesoi(rendId);
      szuroSzoveg = 'Túllépett hataridős részfeladatok:';
      nincsReszfeladatSzoveg = 'Nincsenek túllépett hataridős  részfeladatok a kiválasztott rendezvényen';
    } else {
      response.status(404);
      response.send(`Cannot GET /reszfeladatok/${rendId}/${szurofeltetel}`);
      return;
    }

    const felhasznaloLista = await selectAllFelhasznaloName();
    const rendezvenyLista = await selectAllRendezveny();
    let kivRendezvenyNev = '';
    rendezvenyLista.forEach((rendezveny) => {
      if (rendezveny.rendezvenyId === rendId) {
        kivRendezvenyNev = rendezveny.rendezvenyName;
      }
    });
    response.render('reszfeladatokAdmin', {
      reszfeladatok,
      felhasznaloLista,
      rendezvenyLista,
      szures: true,
      kivRendezvenyId: rendId,
      kivRendezvenyNev,
      szuroSzoveg,
      nincsReszfeladatSzoveg,
    });
  } catch (err) {
    response.status(400);
    response.render('error', { error: err });
  }
});

router.get('', async (_request, response) => {
  try {
    const reszfeladatok = await selectAllReszfeladat();
    const felhasznaloLista = await selectAllFelhasznaloName();
    const rendezvenyLista = await selectAllRendezveny();
    response.render('reszfeladatokAdmin', {
      reszfeladatok, felhasznaloLista, rendezvenyLista, szures: false,
    });
  } catch (err) {
    response.status(400);
    response.render('error', { error: err });
  }
});

export default router;
