// kliens oldal
// eslint-disable-next-line no-unused-vars
async function getSzervezok(rendezvenyID) {
  const id = parseInt(rendezvenyID, 10);
  try {
    const szervezok = await fetch(`/api/szervezok?rendezveny=${id}`);
    const szervezokLista = await szervezok.json();
    let szervezokMegjelenit = 'Szervezok: ';
    if (szervezokLista.length) {
      szervezokLista.forEach((szervezo) => {
        szervezokMegjelenit += `'${szervezo.felhasznaloName}' `;
      });
    } else {
      szervezokMegjelenit += 'Nincs meg szervezo csatlakozva';
    }
    document.getElementById(`szervezok${id}`).innerText = szervezokMegjelenit;
  } catch (err) {
    console.log(err);
    document.getElementById(`szervezok${id}`).innerText = err;
  }
}

// eslint-disable-next-line no-unused-vars
async function updateSzervezok(rendezvenyID, szervezoNev) {
  const id = parseInt(rendezvenyID, 10);
  try {
    const send = {
      rendezveny: id,
      muvelet: document.getElementById(`szervezoGomb${id}`).innerText,
      szervezo: szervezoNev,
    };
    const response = await fetch(`/api/szervezok?rendezveny=${send.rendezveny}&muvelet=${send.muvelet}&szervezo=${send.szervezo}`, {
      method: 'PUT',
    });
    const resp = await response.json();
    document.getElementById(`szervezoEvent${id}`).innerText = resp.message;
    document.getElementById(`szervezoGomb${id}`).innerText = resp.type;
  } catch (err) {
    console.log(err);
    document.getElementById(`szervezok${id}`).innerText = err;
  }
}
