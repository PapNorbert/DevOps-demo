import mysql from 'mysql2/promise.js';

export const connectionPool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'web',
  password: 'webKod887',
  database: 'webprogramozas',
  connectionLimit: 10,
});

export function createTableRendezveny() {
  return connectionPool.query(`CREATE TABLE IF NOT EXISTS Rendezvenyek (
    rendezvenyId INT PRIMARY KEY AUTO_INCREMENT,
    rendezvenyName VARCHAR(255),
    startDate TIMESTAMP,
    endDate TIMESTAMP,
    rendPlace VARCHAR(255)
  )`);
}

export function createTableFelhasznalo() {
  return connectionPool.query(`CREATE TABLE IF NOT EXISTS Felhasznalok (
    felhasznaloID INT PRIMARY KEY AUTO_INCREMENT,
    felhasznaloName VARCHAR(255),
    userName VARCHAR(255),
    userPassword VARCHAR(255),
    userType INT
  )`);
  // userTypes: 0 -> admin,  1 -> szervezo
}

export function createTableSzervezo() {
  return connectionPool.query(`CREATE TABLE IF NOT EXISTS Szervezok (
    rendezvenyId INT,
    szervezoId INT,
    CONSTRAINT PK_Szervezok PRIMARY KEY (rendezvenyId,szervezoId),
    CONSTRAINT FK_SzervezokRendezvenyek FOREIGN KEY (rendezvenyId) REFERENCES Rendezvenyek(rendezvenyId)
  )`);
}

export function createTableFenykep() {
  return connectionPool.query(`CREATE TABLE IF NOT EXISTS Fenykepek (
    fenykepId INT PRIMARY KEY AUTO_INCREMENT,
    fenykepName VARCHAR(255),
    szervezoId INT,
    rendezvenyId INT,
    CONSTRAINT FK_FenykepRendezvenyek FOREIGN KEY (rendezvenyId) REFERENCES Rendezvenyek(rendezvenyId),
    CONSTRAINT FK_FenykepSzervezo FOREIGN KEY (szervezoId) REFERENCES Felhasznalok(felhasznaloID)
  )`);
}

export function createTableReszfeladatok() { // egy reszfeladat egy szervezohoz tartozik
  return connectionPool.query(`CREATE TABLE IF NOT EXISTS Reszfeladatok (
    reszfeladatId INT PRIMARY KEY AUTO_INCREMENT,
    reszfeladatNev VARCHAR(255),
    rendezvenyId INT,
    felelosSzervezoId INT,
    hatarIdo TIMESTAMP,
    elvegezve INT,
    elvegzesDatuma TIMESTAMP,
    CONSTRAINT FK_ReszfeladatokRendezvenyek FOREIGN KEY (rendezvenyId) REFERENCES Rendezvenyek(rendezvenyId),
    CONSTRAINT FK_ReszfeladatokSzervezo FOREIGN KEY (felelosSzervezoId) REFERENCES Felhasznalok(felhasznaloID)
  )`);
}

export function createTableReszfeladatokNaplo() { // egy reszfeladat egy szervezohoz tartozik
  return connectionPool.query(`CREATE TABLE IF NOT EXISTS ReszfeladatokNaplo (
    naplobejegyzesId INT PRIMARY KEY AUTO_INCREMENT,
    reszfeladatId INT,
    modositasDatum TIMESTAMP,
    modositasSzoveg VARCHAR(255),
    regiErtek VARCHAR(255),
    ujErtek VARCHAR(255),
    CONSTRAINT FK_ReszfeladatokNaploReszfeladatok FOREIGN KEY (reszfeladatId) REFERENCES Reszfeladatok(reszfeladatId)
  )`);
}
