"use strict";

const containerCurrency = document.querySelector(".currencies");

let newValue = [];

// Getting the value with four positions after the floating point
function truncate(number, index = 4) {
  return number
    .toString()
    .slice(0, number.toString().indexOf(".") + (index + 1));
}

// Fetching the data for the indexes
const displayCurrency = function () {
  containerCurrency.innerHTML = "";

  fetch("./currencies.json")
    .then((response) => response.json())
    .then(function (data) {
      //   console.log(data.rates);

      for (const [key, value] of Object.entries(data.rates)) {
        let parsedValue = truncate(value, 4);

        // fetching the flags for each available country
        fetch(`https://restcountries.eu/rest/v2/alpha/${key.slice(0, 2)}`)
          .then((response) => response.json())
          .then(function (response) {
            const html = `<div class="currencies__row">
            <div class="currencies__flag"><img class="sample-image" src="images/european-union.png" alt="euro"> <img class="country-image" src="${
              response.flag ? response.flag : "images/browser.png"
            }" alt="flag"></div>
            <div class="currencies__value">${data.base} / ${key}</div>
            
            <div id="currencies-type" class="currencies__type">${
              parsedValue < 1.0001 ? 1.0001 : parsedValue
            }</div>
            </div>`;

            newValue.push(Number(parsedValue));

            containerCurrency.insertAdjacentHTML("beforeend", html);
          });
      }
    })
    .catch((error) => console.log(error));
};

displayCurrency();

console.log(newValue);

setTimeout(() => {
  // Getting the div elements for each index with a liitle delay
  let newCurrency = document.getElementsByClassName("currencies__type");

  // console.log(newCurrency);
  // console.log(newCurrency.length);

  const delay = (n) => new Promise((r) => setTimeout(r, n));

  async function show() {
    for (let i = 0; i < 5; i++) {
      if (i % 2 !== 0) {
        increaseElements(newCurrency);
        await delay(i + 1 * 60300);
      } else {
        decreaseElements(newCurrency);
        await delay(i + 1 * 60300);
      }
    }
  }

  show();
}, 100);

// Decreasing the current indexes by 0.0001
function decreaseElements(newCurrency) {
  let startTime = new Date().getTime();

  let interval = setInterval(() => {
    if (new Date().getTime() - startTime > 60100) {
      clearInterval(interval);
      return;
    }

    for (let i = 0; i < newCurrency.length; i++) {
      if (Number(newCurrency[i].textContent) > 1.0001) {
        newCurrency[i].textContent = `${truncate(
          Number(newCurrency[i].textContent) - 0.0001
        )}`;

        newCurrency[i].classList.add("currencies__type--down");
        newCurrency[i].classList.remove("currencies__type--up");
      } else {
        continue;
      }

      console.log(newCurrency[i].textContent);
    }
  }, 5000);
}

// Increasing the current indexes by 0.0001
function increaseElements(newCurrency) {
  let startTime = new Date().getTime();

  let interval = setInterval(() => {
    if (new Date().getTime() - startTime > 60100) {
      clearInterval(interval);
      return;
    }

    for (let i = 0; i < newCurrency.length; i++) {
      newCurrency[i].textContent = `${truncate(
        Number(newCurrency[i].textContent) + 0.0001
      )}`;

      newCurrency[i].classList.add("currencies__type--up");
      newCurrency[i].classList.remove("currencies__type--down");

      console.log(newCurrency[i].textContent);
    }
  }, 5000);
}
