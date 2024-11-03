// config.js или constants.js
export const baseUrl = "http://localhost:5001/";

export const formattedDate = (date) => {
    return date.slice(0,10).split('-').reverse().join('.')
}
