import express from 'express';
import {
  updateReszfeladatSzervezo, setReszfeladatSzervezoNull, updateReszfeladatStatus,
  checkSzervezoEByReszfeladat, insertSzervezoByReszfeladat, selectReszfeladatElvegzesDatum,
  insertReszfeladatokNaplo, selectReszfeladatSzervezoNeve,
} from '../db/rendezvenyek_db.js';

const router = express.Router();

router.put('', async (request, response, next) => {
  // szervezot allit be egy reszfeladatnal
  const reszfeladatId = request.query.reszfeladatID;
  const szervNev = request.query.szervezoNev;
  const reszfElvegezve = request.query.elvegezve;
  if (reszfElvegezve !== undefined) {
    // ha van egy harmadik parameter is tovabbengedi a kovetkezo feldolgozasnak
    next();
    return;
  }
  try {
    response.set('Content-Type', 'application/json');
    const answer = {
      message: 'Sikeres valtoztatás',
    };
    const naplobejegyzes = {
      reszfeladatId,
      leiras: 'Részfeladatot elvállalt szervező cserélése',
    };
    if (szervNev === 'null') {
      naplobejegyzes.regiErtek = await selectReszfeladatSzervezoNeve(reszfeladatId);
      naplobejegyzes.ujErtek = 'Nincs szervező';
      await setReszfeladatSzervezoNull(reszfeladatId);
      await insertReszfeladatokNaplo(naplobejegyzes);
      answer.szervezo = 'Nem vállalta el még senki';
      answer.gombSzoveg = 'Szervező hozzáadása';
      answer.szervezoGombSzoveg = 'Részfeladat elvállalása';
    } else {
      naplobejegyzes.regiErtek = 'Nincs szervező';
      naplobejegyzes.ujErtek = szervNev;
      const szervezoMar = await checkSzervezoEByReszfeladat(szervNev, reszfeladatId);
      await updateReszfeladatSzervezo(reszfeladatId, szervNev);
      await insertReszfeladatokNaplo(naplobejegyzes);
      if (!szervezoMar) {
        // ha nem volt meg szervezo, hozzaadja a reszfeladatban szereplo adatok alapjan
        await insertSzervezoByReszfeladat(reszfeladatId);
      }
      answer.szervezo = 'Szervező beállítva';
      answer.gombSzoveg = 'Szervező eltávolítása';
      answer.szervezoGombSzoveg = 'Visszalépés';
    }
    response.send(JSON.stringify(answer));
    return;
  } catch (err) {
    console.log(err);
    response.status(400);
    response.render('error', { error: err });
  }
});

router.put('', async (request, response) => {
  // reszfeladat status-at allitja be, elvegeztek vagy nem
  const reszfeladatId = request.query.reszfeladatID;
  const szervNev = request.query.szervezoNev;
  const reszfElvegezve = request.query.elvegezve;
  try {
    response.set('Content-Type', 'application/json');
    if (reszfElvegezve === 'elvegezve') {
      const answer = {
        message: 'Sikeres valtoztatás',
      };
      const naplobejegyzes = {
        reszfeladatId,
        leiras: 'Részfeladatot státuszának beállítása',
        ujErtek: 'Megoldott',
        regiErtek: 'Megoldatlan',
      };
      await updateReszfeladatStatus(reszfeladatId, szervNev);
      await insertReszfeladatokNaplo(naplobejegyzes);
      answer.elvegezve = 'Elvégezve';
      response.send(JSON.stringify(answer));
    } else {
      const answer = {
        message: 'Nem sikerült a változtatás',
      };
      response.send(JSON.stringify(answer));
    }
  } catch (err) {
    console.log(err);
    response.status(400);
    response.render('error', { error: err });
  }
});

router.get('', async (request, response) => {
  // reszfeladat elvegzesenek datumat keri le
  const reszfeladatId = request.query.reszfeladatID;
  try {
    response.set('Content-Type', 'application/json');
    const answer = {
      message: 'Sikeres lekérés',
    };
    answer.datum = await selectReszfeladatElvegzesDatum(reszfeladatId);
    response.send(JSON.stringify(answer));
  } catch (err) {
    console.log(err);
    response.status(400);
    response.render('error', { error: err });
  }
});

export default router;
