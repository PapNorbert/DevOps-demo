/* eslint-disable no-unused-vars */
function redirect() {
  const selectedRendID = document.getElementById('rendID').value;
  if (selectedRendID !== '') {
    window.location.href = `/reszfeladatok/admin/${selectedRendID}/all`;
  }
}

async function updateReszfeladatSzervezo(reszfeladatID) {
  const reszfeladatId = parseInt(reszfeladatID, 10);
  let szervezoNev = null;
  const szervezoSelect =  document.getElementById(`reszf-szervnev-${reszfeladatId}`);
  if (document.getElementById(`gomb-reszf-${reszfeladatId}`).innerText === 'Szervező hozzáadása') {
    szervezoNev = szervezoSelect.value;
  }
  const response = await fetch(`/api/reszfeladatok?reszfeladatID=${reszfeladatId}&szervezoNev=${szervezoNev}`, {
    method: 'PUT',
  });
  const resp = await response.json();
  document.getElementById(`muv-valasz-szoveg-${reszfeladatId}`).innerText = resp.message;
  document.getElementById(`gomb-reszf-${reszfeladatId}`).innerText = resp.gombSzoveg;
  if (resp.szervezo === 'Nem vállalta el még senki') {
    document.getElementById(`szervezo-reszf-${reszfeladatId}`).innerText = resp.szervezo;
  } else {
    document.getElementById(`szervezo-reszf-${reszfeladatId}`).innerText = szervezoSelect.value;
  }
}
