import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const notificationForm = document.querySelector('.form');
const input = document.getElementsByName('state');
const delay = document.querySelector("[name='delay']");

const makePromise = ({ delay, shouldResolve = true }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if(shouldResolve) {
        resolve(delay)
      } else {
        reject(delay)
      }
    }, delay);
  });
};


notificationForm.addEventListener('submit', (e) => {
  e.preventDefault();
  for (let i = 0, length = input.length; i < length; i++) {
    if (input[i].checked) {
     if(input[i].value === "fulfilled" ) {
       makePromise({delay: delay.value})
         .then(value => iziToast.success({
           title: '✅',
           message: `Fulfilled promise in ${value}ms`,
           position: 'topRight',
         }))
         .catch(error => console.log(error));
     }else {
       makePromise({ delay:delay.value, shouldResolve: false })
         .then(value => console.log(value))
         .catch(error => iziToast.error({
           title: "❌",
           message: `Rejected promise in ${error}ms`,
           position: 'topRight',
           timeout: 5000
         }));
     }
      break;
    }
  }
  notificationForm.reset();
})