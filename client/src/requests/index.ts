const SERVER = "http://localhost:3000";

const routes = {
  root: "/",
  data: "/data",
};

function requestData() {
  return fetch(SERVER + routes.data)
    .then((res) => res.json())
    .catch(() => {
      console.log("err");
    });
}

export { requestData };
