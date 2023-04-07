"use strict";

const btnTheme = document.querySelector(".btn-theme");
const btnThemeIcon = document.querySelector(".btn-theme ion-icon");
const btnThemeText = document.querySelector(".btn-theme span");

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

//////////////////////////////////////////////////////////////
// Storing countries list in this array for the sort function
let currentList = [];

////////////////////////////////////////////////////////////
// URLs
const urlAllCountries = `https://restcountries.com/v3.1/all`;
const urlCountry = (country) =>
  `https://restcountries.com/v3.1/name/${country}`;
const urlCountryCioc = (cioc) => `https://restcountries.com/v3.1/alpha/${cioc}`;
const urlRegion = (region) => `https://restcountries.com/v3.1/region/${region}`;

//////////////////////////////////////////////////////////////
// HTML code - cards
const countryCardHTML = (country) => `
<li class="countries__card tile">
  <a href="details.html?name=${country.name.common}">
    <img src="${country.flags.png}" alt="${
  country.flags.alt
}" class="card__img"/>
    <div class="card__textbox">
      <h2 class="card__name">${country.name.common}</h2>
      <p>
        <span class="bold">Population: </span>
        ${country.population.toLocaleString()}
      </p>
      <p><span class="bold">Region: </span>${country.region}</p>
      <p><span class="bold">Capital: </span>${country.capital}</p>
    </div>
  </a>
</li>
`;

//////////////////////////////////////////////////////////////
// HTML code - details
const detailsHTML = async (country) => {
  const borders = await renderBorders(country.borders);
  return `
  <img src="${country.flags.svg}"
       alt="${country.flags.alt}"
       class="details__img tile">
       <div class="details__textbox">
    <h2 class="details__name">${country.name.common}</h2>
    <p><span class="bold">Native name: </span>
    ${country.name.nativeName[Object.keys(country.name.nativeName)[0]].common}
    </p>
    <p><span class="bold">Population: </span>${country.population.toLocaleString()}</p>
    <p><span class="bold">Region: </span>${country.region}</p>
    <p><span class="bold">Sub Region: </span>${country.subregion}</p>
    <p><span class="bold">Capital: </span>${country.capital}</p>
    <p><span class="bold">Top Level Domain: </span>${country.tld}</p>
    <p><span class="bold">Currencies: </span>${
      country.currencies[Object.keys(country.currencies)[0]].name
    }</p>
    <p>
      <span class="bold">Languages: </span>
      ${Object.keys(country.languages).join(", ")}
    </p>
    ${borders}
  </div>
  `;
};

//////////////////////////////////////////////////////////////
// HTML code - borders item
const bordersItemHTML = (country) => `
<li>
<a href="details.html?name=${country.name.common}" class="borders__btn tile">
  <img src="${country.flags.png}" alt="${country.flags.alt}" class="borders__flag">
  <span class="borders__name">${country.name.common}</span>
</a>
</li>
`;

//////////////////////////////////////////////////////////////
// HTML code - borders container
const bordersContainerHTML = (arr) => `
  <div class="details__borders">
    <span class="bold">Border Countries: </span>
    <ul class="borders__list">
    ${arr.reduce((html, country) => (html += bordersItemHTML(country)), "")}
    </ul>
  </div>
`;

//////////////////////////////////////////////////////////////
// HTML code - skeleton cards
const skeletonCountriesHTML = `
<li class="countries__card tile">
  <div class="skeleton skeleton--img card__img"></div>
  <div class="card__textbox">
    <h2 class="card__name skeleton"></h2>
    <p class="skeleton"></p>
    <p class="skeleton"></p>
    <p class="skeleton"></p>
  </div>
</li>
`;

//////////////////////////////////////////////////////////////
// HTML code - skeleton details
const skeletonDetailsHTML = `
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

//////////////////////////////////////////////////////////////
// fetching data
const getData = async function (url) {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(
      `Oops! There seems to be a problem. Please reload the page. 🙇`
    );
  const data = await response.json();
  return data;
};

//////////////////////////////////////////////////////////////
// add html code to it's container
const createHTML = function (container, html) {
  container.innerHTML = html;
};

//////////////////////////////////////////////////////////////
// getData + createHTML
const renderData = async function (
  container,
  url,
  dataHTML,
  skeletonHTML = "",
  setCurrentList = false
) {
  if (skeletonHTML) createHTML(container, skeletonHTML);
  try {
    const data = await getData(url);
    if (setCurrentList) currentList = data;
    const html = await Promise.all(data.map(dataHTML));
    createHTML(container, html.join(""));
  } catch (err) {
    createHTML(container, err.message);
  }
};

//////////////////////////////////////////////////////////////
// present countries cards
const renderCountries = function (url = urlAllCountries) {
  renderData(
    containerCountries,
    url,
    countryCardHTML,
    skeletonCountriesHTML.repeat(8),
    true
  );
};

//////////////////////////////////////////////////////////////
// present country details
const renderDetails = function () {
  const countryName = new URLSearchParams(window.location.search).get("name");
  renderData(
    containerDetails,
    urlCountry(countryName),
    detailsHTML,
    skeletonDetailsHTML
  );
};

//////////////////////////////////////////////////////////////
// fetch and return border conutries in details page
const renderBorders = async function (arr) {
  if (!arr) return "";
  const countries = await Promise.all(
    arr.map(async (cioc) => {
      const [data] = await getData(urlCountryCioc(cioc));
      return data;
    })
  );
  return bordersContainerHTML(countries);
};

//////////////////////////////////////////////////////////////
// dropbtns expand
dropBtn.forEach((btn, i) =>
  btn.addEventListener("click", () => {
    dropdownContent[i === 0 ? 1 : 0].classList.add("hidden");
    dropdownContent[i].classList.toggle("hidden");
  })
);

//////////////////////////////////////////////////////////////
// filter by region + reset filter
const filterCountries = function (str) {
  const isReset = str === "Reset";
  dropBtnLabelFilter.textContent = isReset ? "Filter by Region" : str;
  renderCountries(isReset ? urlAllCountries : urlRegion(str));
};

for (const btn of filterBtns) {
  btn.addEventListener("click", () => {
    filterCountries(btn.textContent);
    dropdownContent[0].classList.add("hidden");
    dropBtnLabelSort.textContent = "Sort by Population";
  });
}

//////////////////////////////////////////////////////////////
// sort by popularity
const sortCountries = function (str) {
  let sortedList =
    str === "Ascending"
      ? currentList.sort((a, b) => a.population - b.population)
      : currentList.sort((a, b) => b.population - a.population);

  dropBtnLabelSort.textContent = str;
  createHTML(containerCountries, sortedList.map(countryCardHTML).join(""));
};

for (const btn of sortBtns) {
  btn.addEventListener("click", () => {
    sortCountries(btn.textContent);
    dropdownContent[1].classList.add("hidden");
  });
}

//////////////////////////////////////////////////////////////
// search
const clearSearch = function () {
  searchInput.value = "";
  searchBtnClear.classList.add("hidden");
  renderCountries();
};

const searchBarEvents = function () {
  searchInput.addEventListener("input", () => {
    if (!searchInput.value) clearSearch();
    else {
      searchBtnClear.classList.remove("hidden");
      renderCountries(urlCountry(searchInput.value));
    }
  });

  searchBtnClear.addEventListener("click", clearSearch);

  searchBtnSubmit.addEventListener("click", () => {
    renderCountries(urlCountry(searchInput.value));
  });
};

//////////////////////////////////////////////////////////////
// theme switch
const savedTheme = localStorage.getItem("theme");

const changeThemeBtn = (str) => {
  btnThemeIcon.name = `${str === "dark" ? `sunny` : "moon"}-outline`;
  btnThemeText.textContent = `${str === "dark" ? `Light` : "Dark"} mode`;
};

const checkTheme = () =>
  document.body.classList.contains("dark") ? "dark" : "light";

if (savedTheme) {
  document.body.classList.toggle("dark", savedTheme === "dark");
  changeThemeBtn(savedTheme);
}

btnTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  changeThemeBtn(checkTheme());
  localStorage.setItem("theme", checkTheme());
});

//////////////////////////////////////////////////////////////
//// init
const pageId = document.body.id;

if (pageId === "index") {
  renderCountries();
  searchBarEvents();
}

if (pageId === "details") renderDetails();
