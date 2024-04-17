function checkAll() {
  const submitButton = document.getElementById('submit-button');
  // file kivalasztasanak ellenorzese
  if (document.getElementById('upfile').value !== '') {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

function onLoad() {
  document.forms.Form.upfile.addEventListener('change', checkAll);
}

document.addEventListener('DOMContentLoaded', onLoad);
