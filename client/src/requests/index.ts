const SERVER = "http://localhost:3000";

export interface CellData {
  secret: string;
  result: string;
  type: "img" | "code";
  rawCode: string;
}

const routes = {
  root: "/",
  data: "/data",
};

export function requestData() {
  return fetch(SERVER + routes.data)
    .then((res) => res.json())
    .catch(() => {
      console.log("err");
    });
}
