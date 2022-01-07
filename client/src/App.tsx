import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import DataCard, { CellData } from "./DataCard";
import { requestData } from "./requests";

function App() {
  const [dataState, setDataState] = useState<Array<CellData>>([]);
  useEffect(() => {
    requestData().then((res) => setDataState(res));
    return () => {};
  }, []);

  return (
    <div className="App">
      <Stack spacing={2}>
        {dataState.map((ele, index) => {
          return <DataCard cellData={ele} key={index} />;
        })}
      </Stack>
    </div>
  );
}

export default App;
