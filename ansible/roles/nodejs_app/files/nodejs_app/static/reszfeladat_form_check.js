function checkCorrect() {
  const hatarido = document.forms.Form.reszfHatarido.value;
  const nev = document.forms.Form.reszfNev.value;

  // hatarido lehet kesobbi/ korabbi is a rendezveny hataridejeinel, ha olyan
  // reszfeladatrol lenne szo, hogy rendezveny elott valamit meg kell csinalni
  // vagy utana valami statisztikat kellene kesziteni
  if (hatarido === '' || hatarido === undefined || nev === '' || nev === undefined) {
    document.getElementById('submit-button').disabled = true;
    return false;
  }
  document.getElementById('submit-button').disabled = false;
  return true;
}

async function updateDates() {
  // beallitja az adott rendezveny kezdeti es befejezesi datumait, hogy lehessen viszonyitani
  try {
    const rendezvenyId = document.getElementById('rendID').value;
    const valaszRendezveny = await fetch(`/api/rendezvenyek?rendezveny=${rendezvenyId}`);
    const rendezveny = await valaszRendezveny.json();
    document.getElementById('rendStartDate').innerText = `${new Date(rendezveny.startDate)}`;
    document.getElementById('rendEndDate').innerText = `${new Date(rendezveny.endDate)}`;
    checkCorrect();
  } catch (err) {
    console.log(err);
    document.getElementById('reszfeladat-hiba').innerText = err;
  }
}

function onLoad() {
  updateDates();
  document.forms.Form.rendID.addEventListener('change', updateDates);
  document.forms.Form.reszfNev.addEventListener('change', checkCorrect);
  document.forms.Form.reszfHatarido.addEventListener('change', checkCorrect);
}

document.addEventListener('DOMContentLoaded', onLoad);
