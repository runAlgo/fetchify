import fetchify from "./fetchify.js";


const api = fetchify.create({
  baseURL: 'http://localhost:3000',
  timeout: 10,
  headers: {'Content-Type': 'application/json', 'x-api-key': 'key'},
});


async function main() {
const response = await api.get("/todos");
const data = await response.json();
console.log(data);

}
main();