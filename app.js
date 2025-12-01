import fetchify from "./fetchify.js";

const api = fetchify.create({
  baseURL: "http://localhost:3000",
  timeout: 1000,
  headers: { "Content-Type": "application/json", "x-api-key": "key" },
});

api.addRequestInterceptor(
  function (config) {
    console.log("intercepting the request...", config)
    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);

api.addResponseInterceptor(
  function(response){
    console.log('response reveiced...', response.status);
    return response;
  }, function(err) {
    return Promise.reject(err);
  }
)

async function main() {
  const response = await api.get("/todos", { timeout: 100 });
  const data = await response.json();
  console.log(data);
}
main();
