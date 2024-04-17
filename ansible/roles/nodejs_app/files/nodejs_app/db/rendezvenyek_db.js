import bcrypt from 'bcrypt';
import {
  connectionPool,
} from './connection_db.js';

export function deleteSzervezo(szervezoId, rendezvenyId) {
  return connectionPool.execute(`DELETE FROM Szervezok WHERE
  rendezvenyId = ? AND szervezoId = ?`, [rendezvenyId, szervezoId]);
}

export async function checkExistSzervezoByRendezvenyId(szervezoID, rendezvenyId) {
  try {
    const [[exists]] = await connectionPool.execute(`SELECT EXISTS (
      SELECT rendezvenyId FROM Szervezok WHERE szervezoId = ? AND rendezvenyId = ? ) AS existing
      `, [szervezoID, rendezvenyId]);
    return (exists.existing !== 0);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function checkExistRendezvenyByRendezvenyId(rendezvenyId) {
  try {
    const [[exists]] = await connectionPool.execute(`SELECT EXISTS (
      SELECT rendezvenyId FROM Rendezvenyek WHERE rendezvenyId = ? ) AS existing
      `, [rendezvenyId]);
    return (exists.existing !== 0);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function checkSzervezoE(felhName, kivalasztottRendezvenyId) {
  try {
    const [[exists]] = await connectionPool.execute(`SELECT EXISTS (SELECT rendezvenyId FROM Szervezok 
      INNER JOIN Felhasznalok ON Felhasznalok.felhasznaloID = Szervezok.szervezoId
      WHERE felhasznaloName = ? AND rendezvenyId = ?) AS existing
      `, [felhName, kivalasztottRendezvenyId]);
    return (exists.existing !== 0);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function checkSzervezoEByReszfeladat(felhName, kivalasztottreszfeladatId) {
  try {
    const [[exists]] = await connectionPool.execute(`SELECT EXISTS (SELECT Szervezok.rendezvenyId FROM Szervezok 
      INNER JOIN Felhasznalok ON Felhasznalok.felhasznaloID = Szervezok.szervezoId
      INNER JOIN Reszfeladatok ON Reszfeladatok.rendezvenyId = Szervezok.rendezvenyId
      WHERE felhasznaloName = ? AND reszfeladatId = ?) AS existing
      `, [felhName, kivalasztottreszfeladatId]);
    return (exists.existing !== 0);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function checkExistFenykep(fenykepNev, szervezoId, rendezvenyId) {
  try {
    const [[exists]] = await connectionPool.execute(`SELECT EXISTS (SELECT fenykepId FROM Fenykepek 
      WHERE fenykepName = ? AND szervezoId = ? AND rendezvenyId = ?) AS existing
    `, [fenykepNev, szervezoId, rendezvenyId]);
    return (exists.existing !== 0);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectRendezvenyID(newRendezveny) {
  try {
    const [[rendID]] = await connectionPool.execute(
      `SELECT rendezvenyId FROM Rendezvenyek
      WHERE rendezvenyName = ? AND startDate = ? AND endDate = ? AND rendPlace = ?`,
      [newRendezveny.rendNev, newRendezveny.rendStartDate,
        newRendezveny.rendEndDate, newRendezveny.rendHelyszin],
    );
    return rendID.rendezvenyId;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectFelhasznaloID(felhasznaloNev) {
  try {
    const [[felhID]] = await connectionPool.execute(
      `SELECT felhasznaloID FROM Felhasznalok
      WHERE felhasznaloName = ?`,
      [felhasznaloNev],
    );
    if (felhID === undefined) { return felhID; }
    return felhID.felhasznaloID;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectAllRendezveny() {
  try {
    const [rendezvenyek] = await connectionPool.query('SELECT * FROM Rendezvenyek');
    return rendezvenyek;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectAllFelhasznaloName() {
  try {
    const [felhasznalok] = await connectionPool.query('SELECT felhasznaloName FROM Felhasznalok');
    return felhasznalok;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectAllReszfeladat() {
  try {
    const [reszfeladatok] = await connectionPool.query(`SELECT reszfeladatNev, hatarIdo, elvegezve, Reszfeladatok.rendezvenyId,
    rendezvenyName, felelosSzervezoId, reszfeladatId, elvegzesDatuma, felhasznaloName FROM Reszfeladatok
INNER JOIN Rendezvenyek On Rendezvenyek.rendezvenyId = Reszfeladatok.rendezvenyId 
LEFT JOIN Felhasznalok On Reszfeladatok.felelosSzervezoId = Felhasznalok.felhasznaloID`);
    return reszfeladatok;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectRendezvenyById(rendezvenyId) {
  try {
    const [[rendezvenyek]] = await connectionPool.execute(`SELECT * FROM Rendezvenyek 
    WHERE rendezvenyId = ?`, [rendezvenyId]);
    return rendezvenyek;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectRendezvenyByFelhasznaloName(felhName) {
  try {
    const [rendezvenyek] = await connectionPool.execute(`SELECT DISTINCT Rendezvenyek.rendezvenyId, Rendezvenyek.rendezvenyName,
    Rendezvenyek.startDate, Rendezvenyek.endDate, Rendezvenyek.rendPlace FROM Rendezvenyek
INNER JOIN Szervezok ON Rendezvenyek.rendezvenyId = Szervezok.rendezvenyId
INNER JOIN Felhasznalok ON Felhasznalok.felhasznaloID = Szervezok.szervezoId
WHERE Felhasznalok.felhasznaloName = ?`, [felhName]);
    return rendezvenyek;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectSzervezokByRendezvenyId(rendezvenyId) {
  try {
    const [szervezok] = await connectionPool.execute(`SELECT felhasznalok.felhasznaloName FROM Szervezok
    JOIN Felhasznalok ON felhasznalok.felhasznaloID = szervezok.szervezoId
    WHERE rendezvenyId = ?`, [rendezvenyId]);
    return szervezok;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectFenykepekByRendezvenyId(rendezvenyId) {
  try {
    const [fenykepek] = await connectionPool.execute(`SELECT fenykepName FROM Fenykepek
    WHERE rendezvenyId = ?`, [rendezvenyId]);
    return fenykepek;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectFelhasznaloIDByUserName(userName) {
  try {
    const [[felhID]] = await connectionPool.execute(
      `SELECT felhasznaloID FROM Felhasznalok
      WHERE userName = ?`,
      [userName],
    );
    if (felhID === undefined) { return felhID; }
    return felhID.felhasznaloID;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectPasswordByUserName(userName) {
  try {
    const [[hashedPasswd]] = await connectionPool.execute(
      `SELECT userPassword FROM Felhasznalok
      WHERE userName = ?`,
      [userName],
    );
    if (hashedPasswd === undefined) { return hashedPasswd; }
    return hashedPasswd.userPassword;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectUserTypeByUserName(userName) {
  try {
    const [[usertype]] = await connectionPool.execute(
      `SELECT userType FROM Felhasznalok
      WHERE userName = ?`,
      [userName],
    );
    return usertype.userType;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectFelhasznaloNameByUserName(userName) {
  try {
    const [[felhName]] = await connectionPool.execute(
      `SELECT felhasznaloName FROM Felhasznalok
      WHERE userName = ?`,
      [userName],
    );
    return felhName.felhasznaloName;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectReszfeladatByRendezvenyId(rendID) {
  try {
    const [reszfeladatok] = await connectionPool.execute(`SELECT reszfeladatNev, hatarIdo, elvegezve, Reszfeladatok.rendezvenyId,
    rendezvenyName, felelosSzervezoId, reszfeladatId, elvegzesDatuma, felhasznaloName FROM Reszfeladatok
INNER JOIN Rendezvenyek On Rendezvenyek.rendezvenyId = Reszfeladatok.rendezvenyId 
LEFT JOIN Felhasznalok On Reszfeladatok.felelosSzervezoId = Felhasznalok.felhasznaloID
WHERE Reszfeladatok.rendezvenyId = ?`, [rendID]);
    return reszfeladatok;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectReszfeladatByRendezvenyIdAndElvegezve(rendID, status) {
  try {
    const [reszfeladatok] = await connectionPool.execute(`SELECT reszfeladatNev, hatarIdo, elvegezve, Reszfeladatok.rendezvenyId,
    rendezvenyName, felelosSzervezoId, reszfeladatId, elvegzesDatuma, felhasznaloName FROM Reszfeladatok
INNER JOIN Rendezvenyek On Rendezvenyek.rendezvenyId = Reszfeladatok.rendezvenyId 
LEFT JOIN Felhasznalok On Reszfeladatok.felelosSzervezoId = Felhasznalok.felhasznaloID
WHERE Reszfeladatok.rendezvenyId = ? AND elvegezve = ?`, [rendID, status]);
    return reszfeladatok;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectReszfeladatByRendezvenyIdAndSzervezo(rendID, szervezoNev) {
  try {
    const [reszfeladatok] = await connectionPool.execute(`SELECT reszfeladatNev, hatarIdo, elvegezve, Reszfeladatok.rendezvenyId,
    rendezvenyName, felelosSzervezoId, reszfeladatId, elvegzesDatuma, felhasznaloName FROM Reszfeladatok
INNER JOIN Rendezvenyek On Rendezvenyek.rendezvenyId = Reszfeladatok.rendezvenyId 
INNER JOIN Felhasznalok On Reszfeladatok.felelosSzervezoId = Felhasznalok.felhasznaloID
WHERE Reszfeladatok.rendezvenyId = ? AND Felhasznalok.felhasznaloName = ?`, [rendID, szervezoNev]);
    return reszfeladatok;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectReszfeladatByRendezvenyIdAndKesoi(rendID) {
  try {
    const [reszfeladatok] = await connectionPool.execute(`SELECT reszfeladatNev, hatarIdo, elvegezve, Reszfeladatok.rendezvenyId,
    rendezvenyName, felelosSzervezoId, reszfeladatId, elvegzesDatuma, felhasznaloName FROM Reszfeladatok
INNER JOIN Rendezvenyek On Rendezvenyek.rendezvenyId = Reszfeladatok.rendezvenyId 
LEFT JOIN Felhasznalok On Reszfeladatok.felelosSzervezoId = Felhasznalok.felhasznaloID
WHERE Reszfeladatok.rendezvenyId = ? AND ( now() > hatarIdo OR elvegzesDatuma > hatarIdo )`, [rendID]);
    return reszfeladatok;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectReszfeladatElvegzesDatum(reszfeladatId) {
  try {
    const [[datum]] = await connectionPool.execute(
      `SELECT elvegzesDatuma FROM Reszfeladatok
      WHERE reszfeladatId = ?`,
      [reszfeladatId],
    );
    return datum.elvegzesDatuma;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectReszfeladatSzervezoNeve(reszfeladatId) {
  try {
    const [[szervezo]] = await connectionPool.execute(
      `SELECT felhasznaloName FROM Reszfeladatok
    INNER JOIN Felhasznalok On Reszfeladatok.felelosSzervezoId = Felhasznalok.felhasznaloID
    WHERE Reszfeladatok.reszfeladatId = ?`,
      [reszfeladatId],
    );
    return szervezo.felhasznaloName;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectReszfeladatId(rendezvenyID, reszfNev, hatarido) {
  try {
    const [[reszfeladatID]] = await connectionPool.execute(
      `SELECT reszfeladatId FROM Reszfeladatok
    WHERE rendezvenyId = ? AND reszfeladatNev = ? AND hatarIdo = ?`,
      [rendezvenyID, reszfNev, hatarido],
    );
    return reszfeladatID.reszfeladatId;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function selectReszfeladatNaplobejegyzesek(rendezvenyID) {
  try {
    const [naplobejegyzesek] = await connectionPool.execute(`SELECT modositasDatum, modositasSzoveg, regiErtek,
    ujErtek, reszfeladatNev FROM ReszfeladatokNaplo
INNER JOIN Reszfeladatok On Reszfeladatok.reszfeladatId = ReszfeladatokNaplo.reszfeladatId 
WHERE Reszfeladatok.rendezvenyId = ?`, [rendezvenyID]);
    return naplobejegyzesek;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export function insertRendezveny(newRendezveny) {
  return connectionPool.execute(`INSERT INTO Rendezvenyek VALUES
  (default, ?, ?, ?, ?)`, [newRendezveny.rendNev, newRendezveny.rendStartDate, newRendezveny.rendEndDate, newRendezveny.rendHelyszin]);
}

export function insertSzervezo(szervezoId, rendezvenyId) {
  return connectionPool.execute(`INSERT INTO Szervezok VALUES
  (?, ?)`, [rendezvenyId, szervezoId]);
}

export function insertFelhasznalo(fullName, userName, password, userType) {
  return connectionPool.execute(`INSERT INTO Felhasznalok VALUES
  (default, ?, ?, ?, ?)`, [fullName, userName, password, userType]);
}

export function insertFenykep(fenykepNev, szervezoId, rendezvenyId) {
  return connectionPool.execute(`INSERT INTO Fenykepek VALUES
  (default, ?, ?, ?)`, [fenykepNev, szervezoId, rendezvenyId]);
}

export function insertReszfeladat(rendezvenyID, reszfNev, hatarido, szervID = null) {
  return connectionPool.execute(`INSERT INTO Reszfeladatok VALUES
  (default, ?, ?, ?, ?, ?, null )`, [reszfNev, rendezvenyID, szervID, hatarido, 0]);
}

export function insertSzervezoByReszfeladat(kivalasztottreszfeladatId) {
  return connectionPool.execute(`INSERT INTO Szervezok (rendezvenyId, szervezoId)
  SELECT rendezvenyId, felelosSzervezoId FROM Reszfeladatok
  WHERE reszfeladatId = ?`, [kivalasztottreszfeladatId]);
}

export async function insertAdmin() {
  try {
    const felhasznaloID = await selectFelhasznaloIDByUserName('admin');
    if (felhasznaloID === undefined) { // nem letezik ilyen nevu felhasznalo
      const hashedPasswd = await bcrypt.hash('admin', 10);
      await insertFelhasznalo('admin', 'admin', hashedPasswd, 0);
    }
    return true;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export function insertReszfeladatokNaplo(naplobejegyzes)  {
  return connectionPool.execute(`INSERT INTO ReszfeladatokNaplo VALUES
  (default, ?, now(), ?, ?, ?)`, [naplobejegyzes.reszfeladatId,
    naplobejegyzes.leiras, naplobejegyzes.regiErtek, naplobejegyzes.ujErtek]);
}

export function updateReszfeladatStatus(reszfeladatId, szervezoNev) {
  return connectionPool.execute(`UPDATE Reszfeladatok
  INNER JOIN Felhasznalok ON Felhasznalok.felhasznaloID = Reszfeladatok.felelosSzervezoId
  SET elvegezve = ?, elvegzesDatuma = now()
  WHERE reszfeladatId = ? AND Felhasznalok.felhasznaloName = ?`, [1, reszfeladatId, szervezoNev]);
}

export function updateReszfeladatSzervezo(reszfeladatId, szervezoNev) {
  return connectionPool.execute(`UPDATE Reszfeladatok
  INNER JOIN Felhasznalok ON Felhasznalok.felhasznaloName = ?
  SET felelosSzervezoId = Felhasznalok.felhasznaloID
  WHERE reszfeladatId = ? `, [szervezoNev, reszfeladatId]);
}

export function setReszfeladatSzervezoNull(reszfeladatId) {
  return connectionPool.execute(`UPDATE reszfeladatok
  SET felelosSzervezoId = NULL
  WHERE reszfeladatId = ?`, [reszfeladatId]);
}
