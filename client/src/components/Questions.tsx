import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CellData, requestData } from "../requests";
import DataCard from "./DataCard";
import { Tab, Tabs } from "@mui/material";
import CodeField from "./CodeField";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const code = `nx, ny = .3, .3
x = np.arange(-6, 6, nx)
  y = np.arange(-6, 6, ny)
X, Y = np.meshgrid(x, y)

dx = -3/2 * X + Y
dy = -1/4 * X - 1/2 * Y

plt.quiver(X, Y, dx, dy, 
           color='Teal', 
           headlength=7, figure=fig)

plt.streamplot(X, Y, dx, dy, color='blue', density=1, cmap='jet', arrowsize=1, figure=fig)`;

export default function Questions() {
  const [dataState, setDataState] = useState<Array<CellData>>([]);
  useEffect(() => {
    requestData().then((res) => setDataState(res));
  }, []);

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: "30px" }}>
        <Box sx={{ flexGrow: 1, flexBasis: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Item One" {...a11yProps(0)} />
              <Tab label="Item Two" {...a11yProps(1)} />
              <Tab label="Item Three" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Stack spacing={2}>
              {dataState.map((ele, index) => {
                return <DataCard cellData={ele} key={index} />;
              })}
            </Stack>
          </TabPanel>
          <TabPanel value={value} index={1}>
            Item Two
          </TabPanel>
          <TabPanel value={value} index={2}>
            Item Three
          </TabPanel>
        </Box>
        <Box sx={{ flexGrow: 1, flexBasis: 0 }}>
          <CodeField code={code} />
        </Box>
      </Box>
    </Box>
  );
}
