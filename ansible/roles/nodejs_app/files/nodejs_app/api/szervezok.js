import express from 'express';
import {
  selectSzervezokByRendezvenyId,
  checkExistSzervezoByRendezvenyId, insertSzervezo, deleteSzervezo, selectFelhasznaloID,
} from '../db/rendezvenyek_db.js';

const router = express.Router();

router.get('', async (request, response) => {
  const kivalasztottRendezvenyId = request.query.rendezveny;
  const szervezok = await selectSzervezokByRendezvenyId(kivalasztottRendezvenyId);
  response.send(szervezok);
});

router.put('', async (request, response) => {
  const kivalasztottRendezvenyId = request.query.rendezveny;
  const muveletTipus = request.query.muvelet;
  const szervezoNev = request.query.szervezo;
  try {
    response.set('Content-Type', 'application/json');
    const szervezoID = await selectFelhasznaloID(szervezoNev);
    if (szervezoID === undefined) { return; }
    const szervezoMar = await
    checkExistSzervezoByRendezvenyId(szervezoID, kivalasztottRendezvenyId);
    if (!szervezoMar) { // ha nem letezik
      if (muveletTipus === 'Visszalepes') {
        response.send(JSON.stringify({
          message: 'A megadott szervezo nem talalhato ennel a rendezvenynel',
          type: 'Csatlakozas',
        }));
        return;
      }
      await insertSzervezo(szervezoID, kivalasztottRendezvenyId);
      response.send(JSON.stringify({
        message: 'Sikeres csatlakozas',
        type: 'Visszalepes',
      }));
      return;
    }
    // ha letezik ilyen szervezo
    if (muveletTipus === 'Visszalepes') {
      await deleteSzervezo(szervezoID, kivalasztottRendezvenyId);
      response.send(JSON.stringify({
        message: 'Sikeres visszalepes',
        type: 'Csatlakozas',
      }));
      return;
    }
    response.send(JSON.stringify({
      message: 'A megadott szervezo mar csatlakozott a rendevenyhez',
      type: 'Visszalepes',
    }));
    return;
  } catch (err) {
    console.log(err);
    response.status(400);
    response.render('error', { error: err });
  }
});

export default router;
