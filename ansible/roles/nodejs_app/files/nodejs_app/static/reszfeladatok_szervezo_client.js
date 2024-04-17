/* eslint-disable no-unused-vars */

async function updateReszfeladatSzervezo(reszfeladatID, szervezoNev) {
  const reszfeladatId = parseInt(reszfeladatID, 10);
  let response = {};
  if (document.getElementById(`gomb-reszf-${reszfeladatId}`).innerText === 'Visszalépés') {
    response = await fetch(`/api/reszfeladatok?reszfeladatID=${reszfeladatId}&szervezoNev=${null}`, {
      method: 'PUT',
    });
  }
  if (document.getElementById(`gomb-reszf-${reszfeladatId}`).innerText === 'Részfeladat elvállalása') {
    response = await fetch(`/api/reszfeladatok?reszfeladatID=${reszfeladatId}&szervezoNev=${szervezoNev}`, {
      method: 'PUT',
    });
  }
  const resp = await response.json();
  document.getElementById(`muv-valasz-szoveg-${reszfeladatId}`).innerText = resp.message;
  document.getElementById(`gomb-reszf-${reszfeladatId}`).innerText = resp.szervezoGombSzoveg;
  if (resp.szervezo === 'Nem vállalta el még senki') {  // visszalepes eseten
    document.getElementById(`szervezo-reszf-${reszfeladatId}`).innerText = resp.szervezo;
    document.getElementById(`elvegezve-gomb-${reszfeladatId}`).style.display = 'none';
  } else {
    document.getElementById(`szervezo-reszf-${reszfeladatId}`).innerText = szervezoNev;
    if (document.getElementById(`reszf-elvegezve-${reszfeladatId}`).innerText === 'Nincs elvégezve') {
      document.getElementById(`elvegezve-gomb-${reszfeladatId}`).style.display = 'block';
    }
  }
}

async function updateReszfeladatElvegezve(reszfeladatID, szervezoNev) {
  const reszfeladatId = parseInt(reszfeladatID, 10);
  let response = await fetch(`/api/reszfeladatok?reszfeladatID=${reszfeladatId}&szervezoNev=${szervezoNev}&elvegezve=elvegezve`, {
    method: 'PUT',
  });
  let resp = await response.json();
  document.getElementById(`muv-valasz-szoveg-${reszfeladatId}`).innerText = resp.message;
  if (resp.message === 'Sikeres valtoztatás') {
    document.getElementById(`elvegezve-gomb-${reszfeladatId}`).style.display = 'none';
    document.getElementById(`reszf-elvegezve-${reszfeladatId}`).innerText = resp.elvegezve;

    response = await fetch(`/api/reszfeladatok?reszfeladatID=${reszfeladatId}`);
    resp = await response.json();
    if (resp.message === 'Sikeres lekérés') {
      document.getElementById(`reszf-elvegezve-datum-${reszfeladatId}`).innerText = new Date(resp.datum);
      document.getElementById(`reszf-elvegezve-datum-p-${reszfeladatId}`).style.display = 'block';
    }
  }
}
