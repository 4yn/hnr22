import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { getStudentData, ResponseData } from "../requests";
import { Tab, Tabs } from "@mui/material";
import CodeField from "./CodeField";
import TextAnswer from "./TextAnswer";

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
  const [dataState, setDataState] = useState<ResponseData>({});
  useEffect(() => {
    getStudentData().then((res) => setDataState(res));
  }, []);

  const [tab, setTab] = useState(0);
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const [code, setCode] = useState("");

  const q1 = dataState["Q1"];

  return (
    <Box>
      <Box sx={{ display: "flex", gap: "30px" }}>
        <Box sx={{ flexGrow: 1, flexBasis: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tab}
              onChange={handleChangeTab}
              aria-label="basic tabs example"
            >
              <Tab label="Item One" {...a11yProps(0)} />
              <Tab label="Item Two" {...a11yProps(1)} />
              <Tab label="Item Three" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={tab} index={0}>
            <Stack spacing={2}>
              {q1 &&
                q1.map(({ answer, code, timestamp, student }) => (
                  <Box
                    key={student.name}
                    onClick={() => {
                      setCode(code);
                    }}
                    sx={{ cursor: "pointer" }}
                  >
                    <TextAnswer
                      name={student.name}
                      answer={answer}
                      timestamp={timestamp}
                    />
                  </Box>
                ))}
            </Stack>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            Item Two
          </TabPanel>
          <TabPanel value={tab} index={2}>
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
