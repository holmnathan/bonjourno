"use strict";

const handle_close_button = () => {
  try {
  const alerts = document.querySelectorAll(".alert");
  
  if (alerts.length !== 0) {
    console.log(alerts);
  for (alert of alerts) {
    alert.classList.remove("hidden-alert");
    console.log(alert);
    const button_close = alert.querySelector(".button-close");
     
    button_close.addEventListener("click", (event) => {
      event.preventDefault();
      alert.classList.add("hidden-alert");
    });
  }
}
} catch (error) {
  console.log(error);
}
}

window.addEventListener("load", handle_close_button);