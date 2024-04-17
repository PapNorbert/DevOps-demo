function checkDates() {
  const startDate = document.forms.Form.start.value;
  const endDate = document.forms.Form.end.value;
  if (startDate === '' || endDate === '') {
    return false;
  }
  if (startDate > endDate) {
    document.getElementById('error-message').style.display = 'block';
    return false;
  }
  document.getElementById('error-message').style.display = 'none';
  return true;
}

function checkAll() {
  const submitButton = document.getElementById('submit-button');
  // minden mezo helyessegenek ellenorzese
  const name = document.forms.Form.nev;
  const rendHelyszin = document.forms.Form.helyszin;
  if (name.value !== '' && checkDates() && rendHelyszin.value !== '') {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

function onLoad() {
  document.getElementById('error-message').style.display = 'none';

  document.forms.Form.nev.addEventListener('change', checkAll);
  document.forms.Form.start.addEventListener('change', checkAll);
  document.forms.Form.end.addEventListener('change', checkAll);
  document.forms.Form.helyszin.addEventListener('change', checkAll);
}

document.addEventListener('DOMContentLoaded', onLoad);
