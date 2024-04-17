import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import secret from '../secrets.js';
import {
  selectFelhasznaloIDByUserName, insertFelhasznalo,
  selectPasswordByUserName, selectUserTypeByUserName, selectFelhasznaloNameByUserName,
} from '../db/rendezvenyek_db.js';

const router = express.Router();

function checkRegisterDataNotEmpty(fullName, userName, password) {
  return (fullName !== undefined && userName !== undefined && password !== undefined
    && fullName !== '' && userName !== '' && password !== '');
}

router.post('/login', async (req, response) => {
  try {
    const dbHashedPassword  = await selectPasswordByUserName(req.fields.userName);
    if (req.fields.password && dbHashedPassword) {
      const correct = await bcrypt.compare(req.fields.password, dbHashedPassword);
      if (correct) {
        let userType = await selectUserTypeByUserName(req.fields.userName);
        if (userType === 0) {
          userType = 'admin';
        }
        if (userType === 1) {
          userType = 'szervezo';
        }
        const felhName = await selectFelhasznaloNameByUserName(req.fields.userName);
        const cookie = jwt.sign(
          {
            felhasznaloName: felhName,
            username: req.fields.userName,
            type: userType,
          },
          secret,
        );
        response.cookie('Cookie', cookie, { httpOnly: true, sameSite: 'strict' });
        response.redirect('/');
        return;
      }
    }
    // ha valahol hiba van, nev vagy jelszo nem talal
    response.status(401);
    const parameterek = {
      userName: req.fields.userName,
      password: req.fields.password,
      hiba: 'Hibas adatok',
    };
    response.render('login', { alapErtekek: parameterek });
  } catch (err) {
    response.status(400);
    response.render('error', { error: err });
  }
});

router.post('/register', async (req, response) => {
  try {
    if (checkRegisterDataNotEmpty(req.fields.fullName, req.fields.userName, req.fields.password)) {
      const felhasznaloID = await selectFelhasznaloIDByUserName(req.fields.userName);
      if (felhasznaloID === undefined) { // nem letezik ilyen nevu felhasznalo
        const hashedPasswd = await bcrypt.hash(req.fields.password, 10);
        await insertFelhasznalo(req.fields.fullName, req.fields.userName, hashedPasswd, 1);
        // utolso parameter userType, 1 -> szervezo
        response.redirect('/');
        return;
      }
    }
    // ha valahol hiba van, mar letezik ilyen nev vagy nincs minden mezo kitoltve
    response.status(400);
    const parameterek = {
      fullName: req.fields.fullName,
      userName: req.fields.userName,
      password: req.fields.password,
      hiba: 'Hiba. Mar foglalt felhasználónév, vagy üres mező',
    };
    response.render('register', { alapErtekek: parameterek });
  } catch (err) {
    response.status(400);
    response.render('error', { error: err });
  }
});

router.get('/register', (req, response) => {
  const parameterek = {
    fullName: undefined,
    userName: undefined,
    password: undefined,
    hiba: undefined,
  };
  response.render('register', { alapErtekek: parameterek });
});

router.get('/login', (req, response) => {
  response.render('login', { alapErtekek: {} });
});

router.use('/logout', (req, response) => {
  if (req.cookies.Cookie) {
    response.clearCookie('Cookie');
  }
  response.redirect('/');
});

export default router;
