import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

Notify.init({});

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(e) {
  const countryName = e.target.value.trim();
  if (countryName === '') {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }

fetchCountries(countryName)
    .then(markup)
    .catch(() => {
      Notify.failure('Oops, there is no country with that name');
      refs.countryList.innerHTML = '';
      refs.countryInfo.innerHTML = '';
    });
}

function markup(countries) {
  const countOfCountries = countries.length;
  if (countOfCountries > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (countOfCountries <= 10 && countOfCountries >= 2) {
      createCountryList(countries);
      refs.countryInfo.innerHTML = '';
    return;
  }
  if (countOfCountries === 1) {
      createCountryCard(countries);
      refs.countryList.innerHTML = '';
  }
}

function createCountryList(countries) {
  const listOfCountries = countries
    .map(
      ({ name: { official: officialName }, flags: { svg: flag } }) =>
        `<li class="country-name">
            <img src="${flag}" alt="${officialName}" width="30" />
            <span>${officialName}</span>
        </li>`
    )
    .join('');
  refs.countryList.innerHTML = listOfCountries;
}

function createCountryCard([
  { name: { official: officialName },
    capital,
    population,
    flags: { svg: flag },
    languages,
  },
]) {
    const listOfLangs = Object.values(languages).join(', ');
    refs.countryInfo.innerHTML = `
    <div class="country-name country-name--highlight">
        <img src="${flag}" alt="${officialName}" width="50" />
        <span>${officialName}</span>
    </div>
    <div><strong>Capital: </strong><span>${capital}</span></div>
    <div><strong>Population: </strong><span>${population}</span></div>
    <div><strong>Languages: </strong><span>${listOfLangs}</span></div>`;
}
