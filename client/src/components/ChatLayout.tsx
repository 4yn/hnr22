import { useEffect, useState } from "react";

import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import axios from 'axios';

import CheckIcon from '@mui/icons-material/Check';
import WarningIcon from '@mui/icons-material/Warning';

import Focus from "./Focus"

interface CellData {
  room: string;
  secret: string;
  idx: number;
  code: string;
  ok: boolean;
  stdout: string;
  stderr: string;
  outputs: Array<Map<string, string>>;
}

export default function ChatLayout() {
  const [cellDatas, setCellDatas] = useState<Array<CellData>>([])
  const [selectedCell, setSelectedCell] = useState<CellData | null>(null)
  useEffect(() => {
    axios.get("/api/data").then((x) => {
      const cellDatas = x.data
      cellDatas.reverse()
      setCellDatas(cellDatas)
    });
  }, [])
  // console.log(cellDatas);

  return <Grid container spacing={2}>
    <Grid item xs={4} md={3} xl={2}>
      <List>
        {cellDatas.map((cellData, idx) =>
          <ListItem key={idx} onClick={() => setSelectedCell(cellData)}>
            <ListItemAvatar>
              <Avatar>
                {cellData.ok ? <CheckIcon /> : <WarningIcon />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={cellData.secret}
            />
          </ListItem>
        )}
      </List>
    </Grid>
    <Grid item xs={8} md={9} xl={10}>
      {
        selectedCell !== null && <Focus cellData={selectedCell} />
      }
    </Grid>
  </Grid>
}