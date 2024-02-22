import flatpickr from "flatpickr";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import "flatpickr/dist/flatpickr.min.css";

let userSelectedDate;
let interval;
const startButton = document.querySelector('button');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if(new Date() < selectedDates[0]) {
      userSelectedDate = selectedDates[0];
      startButton.removeAttribute("disabled");
    }else {
      userSelectedDate = "";
      startButton.setAttribute("disabled", "");
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        zindex: 999,
        position: 'topRight',
        timeout: 50000
      });
    }
  },
};

flatpickr("#datetime-picker", options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const addLeadingZero = (value) => {
  let {days, hours, minutes, seconds} = value;

  days = days.toString().length > 1 ? days : days.toString().padStart(2, "0");
  hours = hours.toString().length > 1 ? hours : hours.toString().padStart(2, "0");
  minutes = minutes.toString().length > 1 ? minutes : minutes.toString().padStart(2, "0");
  seconds = seconds.toString().length > 1 ? seconds : seconds.toString().padStart(2, "0");

  return {days, hours, minutes, seconds};
}

const tick = () => {
  if(Date.parse(userSelectedDate) > Date.now()) {
    createHTML(addLeadingZero(convertMs(Date.parse(userSelectedDate) - Date.now())));
  }else {
    clearInterval(interval);
  }
}

const createHTML = (value) => {
  const {days, hours, minutes, seconds} = value;

  daysSpan.innerHTML = days;
  hoursSpan.innerHTML = hours;
  minutesSpan.innerHTML = minutes;
  secondsSpan.innerHTML = seconds;

}

startButton.addEventListener('click', () => {
  startButton.setAttribute("disabled", "");
  document.getElementById('datetime-picker').disabled = true;
  interval = setInterval(() => {
    tick();
  }, 1000)
})