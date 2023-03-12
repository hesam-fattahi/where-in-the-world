// sort function
// render doesn't work correctly
// details css needs to be fixed
// loading animation (or limit page results)

"use strict";

const btnTheme = document.querySelector(".btn-theme");

const pageList = document.querySelector(".list-page");
const pageDetails = document.querySelector(".details-page");

const btnSearchBar = document.querySelector(".search-bar__btn");
const inputSearchBar = document.querySelector(".search-bar__input");

const btnDropdown = [...document.querySelectorAll(".dropdown__btn")];
const menuDropdown = [...document.querySelectorAll(".dropdown__menu")];

const btnDropdownFilterText = document.querySelector(
  ".dropdown__btn--filter span"
);
const btnFilter = [
  ...document.querySelectorAll(".dropdown__menu--filter li button"),
];
const btnSort = [
  ...document.querySelectorAll(".dropdown__menu--sort li button"),
];

const containerCountries = document.querySelector(".countries");
const countryCards = [...document.querySelectorAll(".countries__card")];

const containerDetails = document.querySelector(".details");

const btnBack = document.querySelector(".btn-back");

const renderCountriesHTML = (arr) => {
  containerCountries.innerHTML = "";
  arr.forEach((el) => {
    let html = `
    <li class="countries__card tile" name="${el.name.common}">
        <a href="#" class="card__link">
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
        </a>
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
  // country.borders.forEach((neighbor) => {
  //   let neighborHTML = `
  //   <li class="border__item">
  //     <a href="#" class="border__btn">${neighbor}</a>
  //   </li>`;
  //   containerBorderCountries.insertAdjacentHTML("beforeend", neighborHTML);
  // });
  containerDetails.insertAdjacentHTML("beforeend", html);
};

const getData = (url, fn) => {
  fetch(url)
    .then((response) => {
      if (!response.ok)
        throw new Error(`Oops! Country not found. (${response.status})`);

      return response.json();
    })
    .then((data) => {
      fn(data);
      console.log(data[0]);
    });
  // .catch(
  //   (err) =>
  //     (containerCountries.innerHTML = `
  //   <p class="error">${err.message}</p>`)
  // );
};

// topbar btn and menu
btnDropdown.forEach((btn, i) =>
  btn.addEventListener("click", () => {
    menuDropdown[i === 0 ? 1 : 0].classList.remove("active");
    menuDropdown[i].classList.toggle("active");
  })
);

// filter
btnFilter.forEach((btn) => {
  btn.addEventListener("click", () => {
    menuDropdown[0].classList.toggle("active");
    if (btn.textContent === "Reset filter") {
      btnDropdownFilterText.textContent = "Filter";
      getData("https://restcountries.com/v3.1/all", renderCountriesHTML);
    } else {
      btnDropdownFilterText.textContent = btn.textContent;
      getData(
        `https://restcountries.com/v3.1/region/${btn.textContent}`,
        renderCountriesHTML
      );
    }
  });
});

// dark mode
btnTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// back button
btnBack.addEventListener("click", () => {
  pageList.classList.toggle("hidden");
  pageDetails.classList.toggle("hidden");
});

countryCards.forEach((card) => {
  card.addEventListener("click", () => {
    getData(
      `https://restcountries.com/v3.1/name/${card.name}?fullText=true`,
      renderDetailsHTML
    );

    pageList.classList.toggle("hidden");
    pageDetails.classList.toggle("hidden");
  });
});

getData("https://restcountries.com/v3.1/all", renderCountriesHTML);
