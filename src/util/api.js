let url
const loc = window.location
if (loc.hostname === 'localhost') {
  url = `${loc.protocol}//${loc.hostname}:3001`
} else {
  url = `${loc.protocol}//api.${loc.host}`
}

export default {
  url,
  apiUrl (str) { return url + str }
}
