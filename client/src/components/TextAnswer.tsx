import { Card, CardContent, Typography } from "@mui/material";

type Props = {
  name: string;
  answer: string;
  timestamp: Date;
};

function TextAnswer({ name, answer, timestamp }: Props) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {name}
        </Typography>
        <Typography variant="h5" component="div">
          {answer}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default TextAnswer;
