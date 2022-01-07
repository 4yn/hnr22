import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type Props = {
  code: string;
};

export default function CodeField({ code }: Props) {
  return (
    <Box
      sx={{
        fontFamily: "Monospace",
        whiteSpace: "pre-wrap",
        backgroundColor: "grey.200",
        padding: "20px",
      }}
    >
      {code}
    </Box>
  );
}
