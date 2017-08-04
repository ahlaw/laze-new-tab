'use strict';

const calendarWidget = (() => {

  const date = document.getElementById('date');
  const dateOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  };

  function getDate() {
    return (new Date()).toLocaleDateString([], dateOptions);
  }

  function updateDate() {
    date.textContent = getDate();
  }

  return { updateDate };

})();


const clockWidget = (() => {

  const clock = document.getElementById('clock');
  const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

  function setOptions(option) {
    if (option === 'hour24') {
      timeOptions.hour = '2-digit';
      timeOptions.hour12 = false;
    }
  }

  function getTime() {
    return (new Date()).toLocaleTimeString([], timeOptions);
  }

  function updateTime() {
    clock.textContent = getTime();
  }

  return { setOptions, updateTime };

})();


const weatherWidget = (() => {

  const initialBackground = '#36454F';
  const weather = document.getElementById('weather');
  const weatherReport = document.getElementById('weather-report');
  const weatherIcon = document.getElementById('weather-icon');
  const apiKey = '0c961933db3128882b28bf88748e871a';
  const apiURL = 'http://api.openweathermap.org/data/2.5/weather?';
  let tempType;

  function fadePageIn() {
    document.body.style.backgroundColor = initialBackground;
  }

  function setOptions(option) {
    tempType = (option === 'farenheit') ? 'imperial' : 'metric';
  }

  function validateReponse(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  function handleError(error) {
    console.warn('Could not get weather data');
    fadePageIn();
  }

  function showWeather(data) {
    let currentTemp = Math.round(data.main.temp);
    let description = data.weather[0].description;
    let conditionCode = data.weather[0].id;
    let timeNow = Math.floor(Date.now() / 1000);
    let timeOfDay;
    if (timeNow > data.sys.sunrise && timeNow < data.sys.sunset) {
      timeOfDay = '-d';
    } else {
      timeOfDay = '-n';
    }
    weatherReport.textContent = currentTemp;
    weatherReport.innerHTML += '&deg';
    weatherReport.textContent += (tempType === 'imperial') ? 'F ' : 'C ';
    weatherReport.textContent += description;
    weatherIcon.className = `owf owf-${conditionCode + timeOfDay}`;
    fadePageIn();
  }

  function updateWeather(apiQuery) {
    fetch(apiURL + apiQuery)
      .then(validateReponse)
      .then(resp => resp.json())
      .then(showWeather)
      .catch(handleError);
  }

  function geoSuccess(position) {
    const params = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      units: tempType,
      APPID: apiKey
    };
    const query = Object.keys(params)
      .map(key => encodeURIComponent(key) + '=' +
        encodeURIComponent(params[key]))
      .join('&');

    updateWeather(query);
  }

  function geoError(error) {
    console.warn(error.code, error.message);
    console.warn('Weather information will not be shown');
    fadePageIn();
  }

  function geolocate() {
    if (window.navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    } else {
      console.warn('Geolocation is not supported by this browser');
    }
  }

  return { setOptions, geolocate };

})();


const buttonWidget = (() => {

  const button = document.getElementById('color-button');
  const funColorList = [
    '#25383C', '#98AFC7', '#4863A0', '#2B547E', '#15317E', '#0041C2',
    '#1569C7', '#6960EC', '#736AFF', '#357EC7', '#368BC1', '#488AC7',
    '#3090C7', '#87AFC7', '#95B9C7', '#157DEC', '#1589FF', '#38ACEC',
    '#3BB9FF', '#81D8D0', '#92C7C7', '#77BFC7', '#78C7C7', '#48CCCD',
    '#43C6DB', '#46C7C7', '#7BCCB5', '#43BFC7', '#3EA99F', '#3B9C9C',
    '#438D80', '#348781', '#307D7E', '#5E7D7E', '#4C787E', '#008080',
    '#4E8975', '#78866B', '#848B79', '#617C58', '#728C00', '#667C26',
    '#254117', '#306754', '#347235', '#437C17', '#387C44', '#347C2C',
    '#347C17', '#348017', '#489258', '#6AA121', '#4AA02C', '#41A317',
    '#3EA055', '#6CBB3C', '#6CC417', '#4CC417', '#52D017', '#4CC552',
    '#54c571', '#99C68E', '#89C35C', '#85BB65', '#8BB381', '#9CB071',
    '#B2C248', '#9DC209', '#A1C935', '#59E817', '#57E964', '#00ff00',
    '#EAC117', '#F2BB66', '#FBB917', '#FBB117', '#FFA62F', '#E9AB17',
    '#E2A76F', '#DEB887', '#C9BE62', '#38A317', '#EE9A4D', '#C8B560',
    '#D4A017', '#C2B280', '#C7A317', '#C68E17', '#B5A642', '#ADA96E',
    '#C19A68', '#CD7F32', '#C88141', '#C58917', '#AF9B60', '#AF7817',
    '#B87333', '#966F33', '#806517', '#827839', '#827B60', '#786D5F',
    '#493D26', '#483C32', '#6f4E37', '#835C3B', '#7F5217', '#7F462C',
    '#C47451', '#C36241', '#C35817', '#C85A17', '#CC6600', '#E56717',
    '#E66C2C', '#F87217', '#F87431', '#E67451', '#FF8040', '#F88017',
    '#FF7F50', '#F88158', '#F9966B', '#E78A61', '#E18B6B', '#E77471',
    '#F57D59', '#E55451', '#E55B3C', '#FF2400', '#F62217', '#F70D1A',
    '#F62817', '#E42217', '#E41B17', '#DC381F', '#C34A2C', '#C24641',
    '#C04000', '#C11B17', '#9F000F', '#990012', '#8C001A', '#954535',
    '#7E3517', '#8A4117', '#7E3817', '#800517', '#810541', '#7D0541',
    '#7E354D', '#7D0552', '#7F4352', '#7FGAG8', '#7F525D', '#B38481',
    '#C48189', '#C48793', '#3799A3', '#E38AA3', '#F660AB', '#FC6C85',
    '#F63G8A', '#F52887', '#E45E9D', '#F535AA', '#FF00FF', '#E3319D',
    '#F433FF', '#D16587', '#C25A7C', '#CA226B', '#C12869', '#C12267',
    '#C25283', '#C12283', '#B93B8F', '#7E587E', '#571B7E', '#583759',
    '#4B0082', '#461B7E', '#4E387E', '#614051', '#5E5A80', '#6A287E',
    '#7D1B7E', '#A74AC7', '#B048B5', '#6C2DC7', '#842DCE', '#8D38C9',
    '#7A5DC7', '#7F38EC', '#8E353F', '#893BFF', '#8467D7', '#A23BEC',
    '#B041FF', '#C45AEC', '#9172EC', '#9E7BFF', '#D462FF', '#E238EC',
    '#C383C7', '#C8A2C8', '#36A9EC', '#C6AEC7'
  ];

  button.addEventListener('click', changeBackgroundColor);

  function getRandomColor() {
    return funColorList[Math.floor(Math.random() * funColorList.length)];
  }

  function changeBackgroundColor() {
    document.body.style.backgroundColor = getRandomColor();
  }

  return { changeBackgroundColor };

})();


chrome.storage.sync.get({
  timeType: 'twelve-hour',
  tempScale: 'celsius'
}, function(items) {

  clockWidget.setOptions(items.timeType);
  weatherWidget.setOptions(items.tempScale);

  weatherWidget.geolocate();

  (function init() {
    calendarWidget.updateDate();
    clockWidget.updateTime();
    setTimeout(init, 1000);
  })();

});

