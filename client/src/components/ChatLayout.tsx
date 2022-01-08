import { useEffect, useRef, useState } from "react";

import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import { styled } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import WarningIcon from "@mui/icons-material/Warning";
import RefreshIcon from "@mui/icons-material/Refresh";
import { green, red, blue } from '@mui/material/colors';

import Focus, { CellData } from "./Focus";
import { Typography } from "@mui/material";

// const ScrollableList = styled(List)(({ theme }) => {
//   return {
//     overflowY: "auto",
//     maxHeight: "75%",
//   };
// });

const SelectableListItemButton = styled(ListItemButton)(({ theme }) => {
  return {
    "&.Mui-selected": {},
  };
});

export default function ChatLayout() {
  const [cellDatas, setCellDatas] = useState<Array<CellData>>([]);
  // const selectedCell = useRef<CellData | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [firstFetched, setFirstFetched] = useState<bool>(false);

  useEffect(() => {
    axios.get("/api/data").then((x) => {
      const cellDatas = x.data;
      setCellDatas(cellDatas);
      setFirstFetched(true);
    });
  }, []);

  useEffect(() => {
    if (firstFetched) {
      var id: any = null;
      const refetch = () => {
        console.log("refetching");
        axios.get("/api/data", {
          params: {
            skip: cellDatas.length
          }
        }).then((x) => {
          const newCellDatas = x.data;
          if (newCellDatas.length) {
            setCellDatas([
              ...cellDatas,
              ...newCellDatas
            ])
          }
          id = setTimeout(refetch, 3000)
        })
      }

      id = setTimeout(refetch, 3000);
      return () => clearTimeout(id);
    }
  }, [cellDatas.length, firstFetched]);

  // useEffect(() => {
  //   selectedIndex !== null && (selectedCell.current = cellDatas[selectedIndex]);
  //   console.log(selectedCell);
  // }, [selectedIndex, cellDatas]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={4} md={3} xl={2}>
        <Box style={{overflowY: "auto", maxHeight: "75vh"}}>
          <List style={{display: "flex", flexFlow: "column-reverse nowrap"}}>
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
                    <Avatar sx={{bgcolor: (
                      cellData.idx === 1 ? blue[500] : (
                        cellData.ok ? green[500] : 
                        red[500]
                      )
                    )}}>
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
          </List>
        </Box>
      </Grid>
      <Grid item xs={8} md={9} xl={10}>
        <Box style={{overflowY: "auto", maxHeight: "90vh"}}>
          {selectedIndex !== null && (
            <Focus cellData={cellDatas[selectedIndex]} />
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
