// details border
// details skeleton

"use strict";

const btnTheme = document.querySelector(".btn-theme");

const pageList = document.querySelector(".list-page");
const pageDetails = document.querySelector(".details-page");
const btnSearch = document.querySelector(".search__btn--search");
const btnCloseSearch = document.querySelector(".search__btn--close");
const inputSearch = document.querySelector(".search__input");

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
const containerDetails = document.querySelector(".details");
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
    <li class="countries__card tile" data-name="${el.name.common}"> 
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
  <img src="${country.flags.svg}" alt="${
    country.flags.alt
  }" class="details__img tile" />
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
    <div class="details__borders">
      <p class="borders__title bold">Border Countries:</p>
      <ul class="border__list"></ul>
    </div>
  </div>`;
  containerDetails.insertAdjacentHTML("beforeend", html);
};

const getDetails = async function (country) {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${country}`
    );
    if (!response.ok)
      throw new Error(
        "Oops! Country not found. Please go back and try again later. 🙇"
      );
    const data = await response.json();
    renderDetailsHTML(data);
    console.log(data);
  } catch (err) {
    console.error(`Error ${err.status}`);
    containerDetails.innerHTML = err.message;
  }
};

const getData = async function (url, func) {
  renderSkeleton();
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Oops! Country not found. Please reload the page. 🙇`);
    const data = await response.json();
    activeList = data;
    func(data);
    const cards = await [...document.querySelectorAll(".countries__card")];
    cards.forEach((card) =>
      card.addEventListener("click", () => {
        pageDetails.classList.toggle("hidden");
        pageList.classList.toggle("hidden");
        getDetails(card.dataset.name);
      })
    );
  } catch (err) {
    console.error(err);
    containerCountries.innerHTML = `<p class="error">${err.message}</p>`;
  }
};

// dropdowns
btnDropdown.forEach((btn, i) =>
  btn.addEventListener("click", () => {
    menuDropdown[i === 0 ? 1 : 0].classList.add("hidden");
    menuDropdown[i].classList.toggle("hidden");
  })
);

// filter
let filterCountries = (region) => {
  if (region === "Reset")
    getData("https://restcountries.com/v3.1/all", renderCountriesHTML);
  else
    getData(
      `https://restcountries.com/v3.1/region/${region}`,
      renderCountriesHTML
    );
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

// sort
let sortCountries = (type) => {
  if (type === "Ascending")
    renderCountriesHTML(activeList.sort((b, a) => b.population - a.population));
  else
    renderCountriesHTML(activeList.sort((a, b) => b.population - a.population));
};

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

// search
const resetSearch = () => {
  inputSearch.value = "";
  btnCloseSearch.classList.add("hidden");
  getData("https://restcountries.com/v3.1/all", renderCountriesHTML);
};

inputSearch.addEventListener("input", () => {
  if (inputSearch.value) {
    btnCloseSearch.classList.remove("hidden");
    getData(
      `https://restcountries.com/v3.1/name/${inputSearch.value}`,
      renderCountriesHTML
    );
  } else resetSearch();
});

btnCloseSearch.addEventListener("click", resetSearch);

btnSearch.addEventListener("click", () => {
  getData(
    `https://restcountries.com/v3.1/name/${inputSearch.value}`,
    renderCountriesHTML
  );
});

// init
getData("https://restcountries.com/v3.1/all", renderCountriesHTML);
renderDetailsHTML();

getDetails("italy");
