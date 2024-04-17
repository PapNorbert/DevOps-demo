import express from 'express';
import { join } from 'path';
import {
  renameSync, unlinkSync,
} from 'fs';
import {
  selectRendezvenyById, selectSzervezokByRendezvenyId, selectFenykepekByRendezvenyId,
  selectFelhasznaloID, insertFenykep, checkExistFenykep,
  checkSzervezoE, checkExistRendezvenyByRendezvenyId,
} from '../db/rendezvenyek_db.js';

const router = express.Router();

async function getData(kivalasztottRendezvenyId) {
  // let rendezvenyReszletes = {};
  try {
    const rendezvenyReszletes = await selectRendezvenyById(kivalasztottRendezvenyId);
    const szervezok = await selectSzervezokByRendezvenyId(kivalasztottRendezvenyId);
    rendezvenyReszletes.szervezok = szervezok;
    const fenykepek = await selectFenykepekByRendezvenyId(kivalasztottRendezvenyId);
    rendezvenyReszletes.fenykepek = fenykepek;
    return rendezvenyReszletes;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

const staticDirectory = join(process.cwd(), 'static');
const uploadDir = join(staticDirectory, 'feltolt');

async function checkSaveFeltoltesForm(szervName, rendID, newName) {
  try {
    const szervezoMar = await checkSzervezoE(
      szervName,
      rendID,
    );
    if (!szervezoMar) {
      return false;
    }
    const szervezoID = await selectFelhasznaloID(szervName);
    // szuksegunk van az id-ra inserthez, ha igaig eljutott biztos letezik

    // ha minden helyes hozzaadjuk a tablahoz is a fenykepet, ha nem letezett
    const letezik = await checkExistFenykep(newName, szervezoID, rendID);
    if (!letezik) { // ha nincs meg hozzaadva
      await insertFenykep(newName, szervezoID, rendID);
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

router.post('', async (request, response) => {
  if (!response.locals.jwt) {
    response.status(401);
    response.render('permission_error', { uzenet: 'Bejelentkezés szükséges fénykép feltöltéshez' });
    return;
  }
  const rendID = request.query.id;
  const file = request.files['upload-file'];
  let hiba = '';
  let szervezoE = false;
  const szervName = response.locals.payload.felhasznaloName;
  try {
    const rendezvenyReszletes = await getData(rendID);
    if (rendID !== undefined) {
      const newName = join(uploadDir, file.name);
      const saveName = join('feltolt',  file.name);
      szervezoE = await checkSaveFeltoltesForm(szervName, rendID, saveName);

      if (!szervezoE) {
        // nem helyesek az adatok
        // file torlese
        unlinkSync(file.path);
        hiba = 'Nincs ilyen nevű szervező a rendezvényen!';
        response.status(400);
        response.render('rendezvenyReszletes', {
          rendezveny: rendezvenyReszletes,
          hiba,
          szervezo: szervezoE,
        });
      } else {
        // ha az adatok megvannak adva, helyesek
        // file atnevezese
        renameSync(file.path, newName);
        response.render('feltoltesSikeres', {
          id: rendID,
          allomanyNev: file.name,
          szervezo: szervezoE,
        });
      }
    } else {
      // nincs minden szukseges mezo megadva
      // file torlese
      unlinkSync(file.path);
      hiba = 'Hiányos adatok!';
      response.status(400);
      response.render('rendezvenyReszletes', {
        rendezveny: rendezvenyReszletes,
        hiba,
        szervezo: szervezoE,
      });
    }
  } catch (err) {
    hiba = err;
    response.status(400);
    response.render('rendezvenyReszletes', {
      rendezveny: undefined,
      hiba,
      szervezo: szervezoE,
    });
  }
});

router.get('', async (request, response) => {
  const kivalasztottRendezvenyId = request.query.rendezveny;
  const letezo = await checkExistRendezvenyByRendezvenyId(kivalasztottRendezvenyId);
  if (!letezo) {
    response.status(400);
    response.render('error', { error: 'Nem létező rendezvény' });
    return;
  }
  const hiba = undefined;
  let szervezoE = false;
  try {
    if (response.locals.jwt) {
      szervezoE = await checkSzervezoE(
        response.locals.payload.felhasznaloName,
        kivalasztottRendezvenyId,
      );
    }
    const rendezvenyReszletes = await getData(kivalasztottRendezvenyId);
    response.render('rendezvenyReszletes', {
      rendezveny: rendezvenyReszletes,
      hiba,
      szervezo: szervezoE,
    });
  } catch (err) {
    console.log(err);
    response.status(400);
    response.render('error', { err });
  }
});

export default router;
