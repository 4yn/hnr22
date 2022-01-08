import { useEffect, useRef, useState } from "react";

import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import { styled } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import WarningIcon from "@mui/icons-material/Warning";
import RefreshIcon from "@mui/icons-material/Refresh";

import Focus, { CellData } from "./Focus";
import { Typography } from "@mui/material";

const ScrollableList = styled(List)(({ theme }) => {
  return {
    overflowY: "auto",
    maxHeight: "75%",
  };
});

const SelectableListItemButton = styled(ListItemButton)(({ theme }) => {
  return {
    "&.Mui-selected": {},
  };
});

export default function ChatLayout() {
  const [cellDatas, setCellDatas] = useState<Array<CellData>>([]);
  // const selectedCell = useRef<CellData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  useEffect(() => {
    axios.get("/api/data").then((x) => {
      const cellDatas = x.data;
      cellDatas.reverse();
      setCellDatas(cellDatas);
    });
  }, []);

  // useEffect(() => {
  //   selectedIndex !== null && (selectedCell.current = cellDatas[selectedIndex]);
  //   console.log(selectedCell);
  // }, [selectedIndex, cellDatas]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={4} md={3} xl={2}>
        <ScrollableList>
          {cellDatas.map((cellData, index) => {
            const date = new Date(cellData.timestamp);
            let dateString = isNaN(date as any as number)
              ? ""
              : date.toLocaleTimeString();
            return (
              <SelectableListItemButton
                key={`${cellData.secret} ${cellData.idx}`}
                onClick={() => setSelectedIndex(index)}
                selected={index === selectedIndex}
              >
                <ListItemAvatar>
                  <Avatar>
                    {cellData.idx === 1 ? <RefreshIcon/> : cellData.ok ? <CheckIcon /> : <WarningIcon />}
                  </Avatar>
                </ListItemAvatar>
                <div>
                  <ListItemText primary={cellData.secret} />
                  <Typography variant="caption" display="block" gutterBottom>
                    <ListItemText
                      primary={dateString}
                      disableTypography={true}
                    ></ListItemText>
                  </Typography>
                </div>
              </SelectableListItemButton>
            );
          })}
        </ScrollableList>
      </Grid>
      <Grid item xs={8} md={9} xl={10}>
        {selectedIndex !== null && (
          <Focus cellData={cellDatas[selectedIndex]} />
        )}
      </Grid>
    </Grid>
  );
}
