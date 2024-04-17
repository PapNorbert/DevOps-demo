import express from 'express';
import {
  insertRendezveny,
} from '../db/rendezvenyek_db.js';

const router = express.Router();

function checkData(rendName, rendStart, rendEnd, rendPlace) {
  return (rendName !== undefined && rendName !== '' && rendName !== undefined && rendStart !== undefined
         && rendEnd !== undefined && rendPlace !== undefined && rendPlace !== '');
}

function checkDateAdmin(rendStart, rendEnd) {
  if (rendStart > rendEnd || rendStart.toString() === 'Invalid Date' || rendEnd.toString() === 'Invalid Date') { return false; }
  return true;
}

async function saveDatatoDatabase(rendName, rendStart, rendEnd, rendPlace) {
  const newRend = {
    rendNev: rendName,
    rendStartDate: rendStart,
    rendEndDate: rendEnd,
    rendHelyszin: rendPlace,
  };

  try {
    await insertRendezveny(newRend);
    return true;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// admin altal rendezveny bevezetes kezelese
router.post('', (request, response) => {
  // az adatok kiolvasasa
  const rendName = request.fields['rendezveny-nev'];
  const rendStart = new Date(request.fields['rendezveny-start-date']);
  const rendEnd = new Date(request.fields['rendezveny-end-date']);
  const rendPlace = request.fields['rendezveny-helyszin'];
  const parameterek = {
    name: request.fields['rendezveny-nev'],
    startDate: request.fields['rendezveny-start-date'],
    endDate: request.fields['rendezveny-end-date'],
    helyszin: request.fields['rendezveny-helyszin'],
    hiba: undefined,
  };
  Object.keys(parameterek).forEach((key) => {
    if (parameterek[key] === '') {
      parameterek[key] = undefined;
    }
  });
  if (checkData(rendName, request.fields['rendezveny-start-date'], request.fields['rendezveny-end-date'], rendPlace)) {
    if (!checkDateAdmin(rendStart, rendEnd)) {
      // nem helyesek a datumok

      parameterek.hiba = 'Nem helyesek a dátumok, rendezvény befejezési dátuma nem lehet a kezdés előtt!';
      response.status(400);
      response.render('form_admin', { alapErtekek: parameterek });
    } else {
      // ha az adatok megvannak adva, a datumok helyesek

      saveDatatoDatabase(rendName, rendStart, rendEnd, rendPlace)
        .then((correct) => {
          if (correct) {
            response.redirect('/');
          }
        })
        .catch((err) => {
          parameterek.hiba = err;
          response.status(400);
          response.render('form_admin', { alapErtekek: parameterek });
        });
    }
  } else {
    // nincs minden szukseges mezo megadva
    parameterek.hiba = 'Hiányos adatok, töltsen ki minden mezőt!';
    response.status(400);
    response.render('form_admin', { alapErtekek: parameterek });
  }
  console.log('Response sent to POST /admin_form');
});

router.get('', (_request, response) => {
  const parameterek = {
    name: undefined,
    startDate: undefined,
    endDate: undefined,
    helyszin: undefined,
    hiba: undefined,
  };
  response.render('form_admin', { alapErtekek: parameterek });
});

export default router;
