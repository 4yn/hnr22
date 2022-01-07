import {
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { CellData } from "../requests";

interface Input {
  cellData: CellData;
}
function DataCard({ cellData: { rawCode, result, secret, type } }: Input) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      {type === "img" ? (
        <CardMedia
          component="img"
          alt=""
          height="140"
          image={`data:image/jpeg;base64,${result}`}
        />
      ) : (
        <h4>Result: {result}</h4>
      )}

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {type}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {rawCode}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default DataCard;
