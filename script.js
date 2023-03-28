// details border
// details skeleton

"use strict";

const btnTheme = document.querySelector(".btn-theme");

const pageList = document.querySelector(".page--list");
const pageDetails = document.querySelector(".page--details");

const searchBtnSubmit = document.querySelector(".search__btn--submit");
const searchBtnClear = document.querySelector(".search__btn--clear");
const searchInput = document.querySelector(".search__input");

const dropBtn = [...document.querySelectorAll(".dropbtn")];
const dropdownContent = [...document.querySelectorAll(".dropdown__content")];
const dropBtnLabelFilter = document.querySelector(".dropbtn--filter span");
const dropBtnLabelSort = document.querySelector(".dropbtn--sort span");
const filterBtns = [
  ...document.querySelectorAll(".dropdown__content--filter button"),
];
const sortBtns = [
  ...document.querySelectorAll(".dropdown__content--sort button"),
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
dropBtn.forEach((btn, i) =>
  btn.addEventListener("click", () => {
    dropdownContent[i === 0 ? 1 : 0].classList.add("hidden");
    dropdownContent[i].classList.toggle("hidden");
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

filterBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    dropdownContent[0].classList.toggle("hidden");
    let btnText = btn.textContent;
    dropBtnLabelFilter.textContent = btnText === "Reset" ? "Filter" : btnText;
    dropBtnLabelSort.textContent = "Sort";
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

sortBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    dropdownContent[1].classList.toggle("hidden");
    dropBtnLabelSort.textContent = btn.textContent;
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
  searchInput.value = "";
  btnCloseSearch.classList.add("hidden");
  getData("https://restcountries.com/v3.1/all", renderCountriesHTML);
};

searchInput.addEventListener("input", () => {
  if (searchInput.value) {
    btnCloseSearch.classList.remove("hidden");
    getData(
      `https://restcountries.com/v3.1/name/${searchInput.value}`,
      renderCountriesHTML
    );
  } else resetSearch();
});

btnCloseSearch.addEventListener("click", resetSearch);

searchBtnSubmit.addEventListener("click", () => {
  getData(
    `https://restcountries.com/v3.1/name/${searchInput.value}`,
    renderCountriesHTML
  );
});

// init
getData("https://restcountries.com/v3.1/all", renderCountriesHTML);
renderDetailsHTML();
