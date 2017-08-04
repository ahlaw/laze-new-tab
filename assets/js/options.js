function getRadioFormValue(form) {
  for (let i = 0; i < form.length; i++) {
    if (form[i].checked) {
      return form[i].value;
    }
  }
}

function setRadioFormValue(form, value) {
  for (let i = 0; i < form.length; i++) {
    if (form[i].value === value) {
      form[i].checked = true;
      break;
    }
  }
}

function saveOptions() {
  const timeForm = document.getElementById('time');
  const tempForm = document.getElementById('temp');
  const timeType = getRadioFormValue(timeForm);
  const tempScale = getRadioFormValue(tempForm);
  chrome.storage.sync.set({
    timeType,
    tempScale
  }, function() {
    const status = document.getElementById('status');
    status.textContent = 'Options saved!';
    setTimeout(() => {
      status.textContent = '';
    }, 1000);
  });
}

function restoreOptions() {
  const timeForm = document.getElementById('time');
  const tempForm = document.getElementById('temp');
  chrome.storage.sync.get({
    timeType: 'hour12',
    tempScale: 'celcius'
  }, function(items) {
    setRadioFormValue(timeForm, items.timeType);
    setRadioFormValue(tempForm, items.tempScale);
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
