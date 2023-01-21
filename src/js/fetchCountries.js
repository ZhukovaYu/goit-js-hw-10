const BASE_URL = 'https://restcountries.com';
const FIELDS = 'name,capital,population,flags,languages';

export function fetchCountries(name) {
  return fetch(
    `${BASE_URL}/v3.1/name/${name}?fields=${FIELDS}`
    ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}