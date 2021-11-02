let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
    // clear any existing timer first
    clearInterval(countdown);

  const now = Date.now();  // get current timestamp in milliseconds
  const then = now + (seconds * 1000);  // end time
  displayTimeLeft(seconds);
  displayEndTime(then);
  
  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000); // Math.round 반올림
    // check if we should stop it
    if (secondsLeft < 0) {
        clearInterval(countdown);
        return;
    }

    // display it
    displayTimeLeft(secondsLeft);
  }, 1000);
};

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60); // Math.floor 내림
    const remainderSeconds = seconds % 60;
    // console.log({minutes, remainderSeconds});

    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    timerDisplay.textContent = display;
    document.title = display;
}

function displayEndTime(timestamp) {
    const end = new Date(timestamp);
    const hours = end.getHours();
    const minutes = end.getMinutes();
    const adjustedHour = hours > 12 ? hours - 12 : hours;
    endTime.textContent = `Be Back at ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}`;
}


function startTimer() {
    const seconds = parseInt(this.dataset.time); // string to num
    console.log(seconds);

    timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));
// if elements has name attribute, can use it directly => document.customForm.minutes
document.customForm.addEventListener('submit', function (e) {   
   e.preventDefault();  // prevent page reloading 

   const mins = this.minutes.value;
   console.log(mins);
   
   timer(mins * 60);
   this.reset(); // reset the input box
});

/*
    Date.now() // 1635873275461 (timestamp => where you have time infos)
    new Date(1635873275461) // Tue Nov 02 2021 17:14:35 GMT+0000 (Greenwich Mean Time)
    let x = new Date(1635873275461)
    x.getDate() // 2
*/