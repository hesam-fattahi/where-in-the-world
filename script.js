"use strict";

const btnTheme = document.querySelector(".btn-theme");
const btnThemeIcon = document.querySelector(".btn-theme ion-icon");
const btnThemeText = document.querySelector(".btn-theme span");

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
const containerDetails = document.querySelector(".details");

const btnBack = document.querySelector(".btn-back");

let activeList = [];

const urlAllCountries = `https://restcountries.com/v3.1/all`;

const renderSkeletonCards = function () {
  containerCountries.innerHTML = `
  <li class="countries__card tile">
  <div class="skeleton skeleton--img card__img"></div>
  <div class="card__textbox">
    <h2 class="card__name skeleton"></h2>
    <p class="skeleton"></p>
    <p class="skeleton"></p>
    <p class="skeleton"></p>
  </div>
</li>
  `.repeat(8);
};

const renderSkeletonDetails = function () {
  containerDetails.innerHTML = `
  <div class="skeleton skeleton__img details__img"></div>
  <div class="details__textbox">
    <h2 class="skeleton details__name"></h2>
    <p class="skeleton"></p>
    <p class="skeleton"></p>
    <p class="skeleton"></p>
    <p class="skeleton"></p>
    <p class="skeleton"></p>
    <p class="skeleton"></p>
    <p class="skeleton"></p>
    <p class="skeleton"></p>
  </div>
`;
};

const renderCountriesHTML = function (arr) {
  containerCountries.innerHTML = "";
  arr.forEach((el) => {
    let html = `
    <li class="countries__card tile" data-name="${el.name.common}">
    <img src="${el.flags.png}" alt="${el.flags.alt}" class="card__img" />
    <div class="card__textbox">
      <h2 class="card__name">${el.name.common}</h2>
      <p><span class="bold">Population: </span>${el.population.toLocaleString()}</p>
      <p><span class="bold">Region: </span>${el.region}</p>
      <p><span class="bold">Capital: </span>${el.capital}</p>
    </div>
  </li>
    `;
    containerCountries.insertAdjacentHTML("beforeend", html);
  });
};

const renderBorderCountries = async function (arr) {
  if (arr.length > 0) {
    const countries = await Promise.all(
      arr.map(async (code) => {
        const [data] = await fetchData(
          `https://restcountries.com/v3.1/alpha/${code}`
        );
        return data;
      })
    );
    const countriesHTML = countries.map(
      (country) =>
        `
    <li>
    <button class="borders__btn tile" data-name="${country.name.common}">
      <img src="${country.flags.svg}" alt="${country.flags.alt}" class="borders__flag">
      <span class="borders__name">${country.name.common}</span>
      </button>
      </li>
      `
    );
    return countriesHTML.join("");
  } else return "No border countries.";
};

const renderDetailsHTML = async function ([country]) {
  containerDetails.innerHTML = "";
  let html = `
    <img src="${country.flags.svg}" alt="${
    country.flags.alt
  }" class="details__img tile">
    <div class="details__textbox">
      <h2 class="details__name">${country.name.common}</h2>
      <p><span class="bold">Native name: </span>
        ${
          country.name.nativeName[Object.keys(country.name.nativeName)[0]]
            .common
        }
      </p>
      <p><span class="bold">Population: </span>${country.population.toLocaleString()}</p>
      <p><span class="bold">Region: </span>${country.region}</p>
      <p><span class="bold">Sub Region: </span>${country.subregion}</p>
      <p><span class="bold">Capital: </span>${country.capital}</p>
      <p><span class="bold">Top Level Domain: </span>${country.tld}</p>
      <p><span class="bold">Currencies: </span>${
        country.currencies[Object.keys(country.currencies)[0]].name
      }</p>
      <p><span class="bold">Languages: </span>${Object.keys(
        country.languages
      ).join(", ")}</p>
      <div class="details__borders">
        <span class="bold">Border Countries: </span>
        <ul class="borders__list">
        ${await renderBorderCountries(country.borders)}
        </ul>
      </div>
    </div>
  `;
  containerDetails.insertAdjacentHTML("beforeend", html);
};

const fetchData = async function (url) {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(
      `Oops! There seems to be a problem. Please reload the page. 🙇`
    );
  const data = await response.json();
  return data;
};

const renderCards = async function (url) {
  renderSkeletonCards();
  try {
    const countries = await fetchData(url);
    renderCountriesHTML(countries);
    activeList = countries;
    const cardsHTML = await [...document.querySelectorAll(".countries__card")];
    cardsHTML.forEach((card) => {
      card.addEventListener("click", () => {
        cardLink(card.dataset.name);
        document.title = `${card.dataset.name} | Where in the world`;
      });
    });
  } catch (err) {
    containerCountries.innerHTML = `<p class="error">${err.message}`;
  }
};

const renderDetails = async function (url) {
  renderSkeletonDetails();
  try {
    const details = await fetchData(url);
    await renderDetailsHTML(details);
    const bordersHTML = await [...document.querySelectorAll(".borders__btn")];
    bordersHTML.forEach((btn) =>
      btn.addEventListener("click", () => {
        renderDetails(
          `https://restcountries.com/v3.1/name/${btn.dataset.name}`
        );
        document.title = `${btn.dataset.name} | Where in the world`;
      })
    );
  } catch (err) {
    containerDetails.innerHTML = `<p class="error">${err.message}`;
  }
};

const cardLink = function (country) {
  switchPage();
  renderDetails(`https://restcountries.com/v3.1/name/${country}`);
};

const switchPage = function () {
  pageList.classList.toggle("hidden");
  pageDetails.classList.toggle("hidden");
};

//////////////////////////////
//// dropdowns
dropBtn.forEach((btn, i) =>
  btn.addEventListener("click", () => {
    dropdownContent[i === 0 ? 1 : 0].classList.add("hidden");
    dropdownContent[i].classList.toggle("hidden");
  })
);

//////////////////////////////
//// filter
filterBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    dropdownContent[0].classList.toggle("hidden");
    let btnText = btn.textContent;
    if (btnText === "Reset") {
      dropBtnLabelFilter.textContent = "Filter by Region";
      renderCards(urlAllCountries);
    } else {
      dropBtnLabelFilter.textContent = btnText;
      renderCards(`https://restcountries.com/v3.1/region/${btnText}`);
    }
    dropBtnLabelSort.textContent = "Sort by Population";
  })
);

//////////////////////////////
//// sort
sortBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    dropdownContent[1].classList.toggle("hidden");
    dropBtnLabelSort.textContent = btn.textContent;
    if (btn.textContent === "Ascending")
      renderCountriesHTML(
        activeList.sort((b, a) => b.population - a.population)
      );
    else
      renderCountriesHTML(
        activeList.sort((a, b) => b.population - a.population)
      );
  })
);

//////////////////////////////
//// theme switch

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  document.body.classList.toggle("dark", savedTheme === "dark");
  btnThemeText.textContent = savedTheme === "dark" ? "Light mode" : "Dark mode";
  btnThemeIcon.name = savedTheme === "dark" ? "sunny-outline" : "moon-outline";
}

btnTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDarkMode = document.body.classList.contains("dark");
  btnThemeText.textContent = isDarkMode ? "Light mode" : "Dark mode";
  btnThemeIcon.name = isDarkMode ? "sunny-outline" : "moon-outline";

  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
});

//////////////////////////////
//// details page's back button
btnBack.addEventListener("click", () => {
  switchPage();
  document.title = `Where in the world | Encyclopedia of the world's countries`;
});

//////////////////////////////
//// search
const resetSearch = function () {
  searchInput.value = "";
  searchBtnClear.classList.add("hidden");
  renderCards(urlAllCountries);
};

searchInput.addEventListener("input", () => {
  if (searchInput.value) {
    searchBtnClear.classList.remove("hidden");
    renderCards(`https://restcountries.com/v3.1/name/${searchInput.value}`);
  } else resetSearch();
});

searchBtnClear.addEventListener("click", resetSearch);

searchBtnSubmit.addEventListener("click", () => {
  renderCards(`https://restcountries.com/v3.1/name/${searchInput.value}`);
});

//////////////////////////////
//// init
renderCards(urlAllCountries);
