import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent"
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Questions from "./Questions";
import ChatLayout from "./ChatLayout";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright LOLLOLLOL © "}
      {new Date().getFullYear()}
    </Typography>
  );
}

const theme = createTheme();

export default function Main() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Pynoculars
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Container sx={{ py: 2 }} maxWidth="xl">
          <Box sx={{pb: 2}}>
            <Card>
              <CardContent>
                <p>Add this to your jupyter notebook to get <code>pynoculars</code>!</p>
                <pre>
                  ! wget https://eg.ress.me/api/script -O pynoculars.py
                  <br/>
                  %load_ext pynoculars
                </pre>
                <details>
                  <summary>Are you using google colab?</summary>
                  <p>Google colab is a bit outdated, run this (before the above) to upgrade and restart the notebook for your pynoculars to work!</p>
                  <pre>
                  !pip install -q --upgrade ipython <br/>
                  !pip install -q --upgrade ipykernel <br/>
                  import os <br/>
                  import signal <br/>
                  os.kill(os.getpid(), signal.SIGTERM) <br/>
                  </pre>
                </details>
              </CardContent>
            </Card>
          </Box>
          {/* <Questions /> */}
          <ChatLayout />
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          {/* Footer */}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          {/* Something here to give the footer a purpose! */}
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}
