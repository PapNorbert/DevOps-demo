/* eslint-disable no-unused-vars */

async function updateAvailableOperation(frissitHiba = true) {
  if (frissitHiba) {
    document.getElementById('szerv-muveletek-hiba').innerText = '';
  }
  const rendezvenyId = document.getElementById('rendID').value;
  const szervezoNev = document.getElementById('nev').value;
  let muvelet = 'hozzaad';
  // feltetelezzuk, h hozzaadni kell
  const szervezok = await fetch(`/api/szervezok?rendezveny=${rendezvenyId}`);
  const szervezokLista = await szervezok.json();
  let szervezokListaSzoveg = '';
  szervezokLista.forEach((szervezo) => {
    szervezokListaSzoveg += `'${szervezo.felhasznaloName}' `;
    if (szervezoNev === szervezo.felhasznaloName) {
      muvelet = 'visszalep';
    }
  });

  document.getElementById('rend-szervezok').innerText = `Kiválasztott rendezvény szervezői:   ${szervezokListaSzoveg}`;

  if (muvelet === 'hozzaad') {
    document.getElementById('visszalepes').style.display = 'none';
    document.getElementById('hozzaadas').style.display = 'block';
  } else {
    document.getElementById('visszalepes').style.display = 'block';
    document.getElementById('hozzaadas').style.display = 'none';
  }
}

async function updateSzervezok() {
  const id = document.getElementById('rendID').value;
  const szervezoNev = document.getElementById('nev').value;
  try {
    const send = {
      rendezveny: id,
      szervezo: szervezoNev,
    };
    if (document.getElementById('visszalepes').style.display === 'block') {
      send.muvelet = 'Visszalepes';
    } else {
      send.muvelet = 'Csatlakozas';
    }
    const response = await fetch(`/api/szervezok?rendezveny=${send.rendezveny}&muvelet=${send.muvelet}&szervezo=${send.szervezo}`, {
      method: 'PUT',
    });
    const resp = await response.json();
    document.getElementById('szerv-muveletek-hiba').innerText = resp.message;
    updateAvailableOperation(false);
  } catch (err) {
    console.log(err);
    document.getElementById('szerv-muveletek-hiba').innerText = err;
  }
}
