import fetchify from "./fetchify.js";


const api = fetchify.create({
  baseURL: 'http://localhost:3000',
  timeout: 1000,
  headers: {'Content-Type': 'application/json'},
});


async function main() {
const response = await api.get("/todos");
// const data = await response.json();
console.log(response);
}
main();