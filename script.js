"use strict";

const btnTheme = document.querySelector(".btn-theme");

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

// dark mode
btnTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

const renderHTML = (arr) => {
  containerCountries.innerHTML = "";
  arr.forEach((country) => {
    let html = `
        <li class="countries__card tile">
            <a href="#" class="card__link">
                <img src="${country.flags.png}" alt="${
      country.flags.alt
    }" class="card__img" />
                <div class="card__text-box">
                    <h2 class="card__name">${country.name.common}</h2>
                    <p class="card__info">
                    <span class="bold">Population: </span>
                    ${country.population
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </p>
                    <p class="card__info">
                    <span class="bold">Region: </span>
                    ${country.region}
                    </p>
                    <p class="card__info">
                    <span class="bold">Capital: </span>
                    ${country.capital}
                    </p>
                </div>
            </a>
        </li>
        `;
    containerCountries.insertAdjacentHTML("beforeend", html);
  });
};

const getCountries = (url, sort = "") => {
  fetch(url)
    .then((response) => {
      if (!response.ok)
        throw new Error(`Oops! Country not found. (${response.status})`);
      return response.json();
    })
    .then((data) => {
      if (sort === "Ascending") {
        renderHTML(data.sort((a, b) => a.population - b.population));
      } else if (sort === "Descending") {
        renderHTML(data.sort((a, b) => b.population - a.population));
      } else {
        renderHTML(data);
      }
    })
    .catch(
      (err) =>
        (containerCountries.innerHTML = `
    <p class="error">${err.message}</p>`)
    );
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
      getCountries("https://restcountries.com/v3.1/all");
    } else {
      btnDropdownFilterText.textContent = btn.textContent;
      getCountries(`https://restcountries.com/v3.1/region/${btn.textContent}`);
    }
  });
});

// sort
btnSort.forEach((btn) => {
  btn.addEventListener("click", () => {
    menuDropdown[1].classList.toggle("active");

    let url =
      btnDropdownFilterText.textContent === "Filter"
        ? "https://restcountries.com/v3.1/all"
        : `https://restcountries.com/v3.1/region/${btnDropdownFilterText.textContent}`;
    getCountries(url, btn.textContent);
  });
});

getCountries("https://restcountries.com/v3.1/all");
