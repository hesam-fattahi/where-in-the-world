// link to details page
// details page css
// search bar

"use strict";

const btnTheme = document.querySelector(".btn-theme");

const pageList = document.querySelector(".list-page");
const pageDetails = document.querySelector(".details-page");

const btnSearchBar = document.querySelector(".search-bar__btn");
const inputSearchBar = document.querySelector(".search-bar__input");
const btnDropdown = [...document.querySelectorAll(".dropdown__btn")];
const menuDropdown = [...document.querySelectorAll(".dropdown__menu")];
const labelDropdownFilter = document.querySelector(
  ".dropdown__btn--filter span"
);
const labelDropdownSort = document.querySelector(".dropdown__btn--sort span");
const btnsFilter = [
  ...document.querySelectorAll(".dropdown__menu--filter li button"),
];
const btnsSort = [
  ...document.querySelectorAll(".dropdown__menu--sort li button"),
];
const containerCountries = document.querySelector(".countries");
const countryCards = [...document.querySelectorAll(".countries__card")];
const loadingCards = [...document.querySelectorAll(".loading__card")];
const containerDetails = document.querySelector(".details-page");
const btnBack = document.querySelector(".btn-back");

let activeList = [];

const renderSkeleton = () => {
  containerCountries.innerHTML = "";
  let html = `
  <li class="countries__card loading__card tile">
    <div class="loading__img card__img"></div>
    <div class="card__text-box">
      <div class="loading__text loading__text--big card__name"></div>
      <div class="loading__text loading__text--small"></div>
      <div class="loading__text loading__text--small"></div>
      <div class="loading__text loading__text--small"></div>
    </div>
  </li>
  `;
  for (let i = 0; i < 8; i++)
    containerCountries.insertAdjacentHTML("beforeend", html);
};

const renderCountriesHTML = (arr) => {
  containerCountries.innerHTML = "";
  arr.forEach((el) => {
    let html = `
    <li class="countries__card tile" name="${el.name.common}"> 
            <img src="${el.flags.png}" alt="${
      el.flags.alt
    }" class="card__img" />
            <div class="card__text-box">
                <h2 class="card__name">${el.name.common}</h2>
                <p class="card__info">
                <span class="bold">Population: </span>
                ${el.population
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </p>
                <p class="card__info">
                <span class="bold">Region: </span>
                ${el.region}
                </p>
                <p class="card__info">
                <span class="bold">Capital: </span>
                ${el.capital}
                </p>
            </div>
    </li>
    `;
    containerCountries.insertAdjacentHTML("beforeend", html);
  });
};

const renderDetailsHTML = ([country]) => {
  containerDetails.innerHTML = "";
  let html = `
  <img src="${country.flags.png}" alt="${
    country.flags.alt
  }" class="details__img" />
  <div class="details__text">
    <h2 class="details__name">${country.name.common}</h2>
    <ul class="details__list">
      <li class="details__item">
        <span class="bold">Native name: </span>
       ${
         country.name.nativeName[Object.keys(country.name.nativeName)[0]].common
       }
      </li>
      <li class="details__item">
        <span class="bold">Population: </span>
        ${country.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </li>
      <li class="details__item">
        <span class="bold">Region: </span>
        ${country.region}
      </li>
      <li class="details__item">
        <span class="bold">Sub Region: </span>
        ${country.subregion}
      </li>
      <li class="details__item">
        <span class="bold">Capital: </span>
        ${country.capital}
      </li>
      <li class="details__item">
        <span class="bold">Top Level Domain: </span>
        ${country.tld}
      </li>
      <li class="details__item">
        <span class="bold">Currencies: </span>
        ${country.currencies[Object.keys(country.currencies)[0]].name}
      </li>
      <li class="details__item">
        <span class="bold">Languages: </span>
        ${country.languages[Object.keys(country.languages).join(", ")]}
      </li>
    </ul>
    <div class="details__border-box">
      <p class="border__title bold">Border Countries:</p>
      <ul class="border__list">
      ${country.borders.forEach(
        (el) =>
          `<li class="border__item">
              <a href="#" class="border__btn">${el}</a>
            </li>`
      )}
      </ul>
    </div>
  </div>
  `;
  containerDetails.insertAdjacentHTML("beforeend", html);
};

// const getData = (url, fn) => {
//   renderSkeleton();
//   fetch(url)
//     .then((response) => {
//       if (!response.ok)
//         throw new Error(`Oops! Country not found. (${response.status})`);

//       return response.json();
//     })
//     .then((data) => {
//       fn(data);
//       activeList = data;
//     })
//     .catch(
//       (err) =>
//         (containerCountries.innerHTML = `
//     <p class="error">${err.message}</p>`)
//     )
//     .finally(() =>
//       loadingCards.forEach((card) => card.classList.add("hidden"))
//     );
// };

const getData = async function (url, func) {
  renderSkeleton();
  const response = await fetch(url);
  const data = await response.json();
  activeList = data;
  func(data);
};

// dropdowns
btnDropdown.forEach((btn, i) =>
  btn.addEventListener("click", () => {
    menuDropdown[i === 0 ? 1 : 0].classList.add("hidden");
    menuDropdown[i].classList.toggle("hidden");
  })
);

// filter and sort
let filterCountries = (region) => {
  if (region === "Reset")
    getData("https://restcountries.com/v3.1/all", renderCountriesHTML);
  else
    getData(
      `https://restcountries.com/v3.1/region/${region}`,
      renderCountriesHTML
    );
};

let sortCountries = (type) => {
  if (type === "Ascending")
    renderCountriesHTML(activeList.sort((b, a) => b.population - a.population));
  else
    renderCountriesHTML(activeList.sort((a, b) => b.population - a.population));
};

btnsFilter.forEach((btn) =>
  btn.addEventListener("click", () => {
    menuDropdown[0].classList.toggle("hidden");
    let btnText = btn.textContent;
    labelDropdownFilter.textContent = btnText === "Reset" ? "Filter" : btnText;
    labelDropdownSort.textContent = "Sort";
    filterCountries(btnText);
  })
);

btnsSort.forEach((btn) =>
  btn.addEventListener("click", () => {
    menuDropdown[1].classList.toggle("hidden");
    labelDropdownSort.textContent = btn.textContent;
    sortCountries(btn.textContent);
  })
);

// dark mode
btnTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// back button
btnBack.addEventListener("click", () => {
  pageList.classList.toggle("hidden");
  pageDetails.classList.toggle("hidden");
});

getData("https://restcountries.com/v3.1/all", renderCountriesHTML);
