import { createTheme, ThemeProvider } from "@mui/material";

const COLOR = "#b26362";

const theme = createTheme({
  palette: {
    primary: {
      main: COLOR,
    },
  },
});

function CustomThemeProvider(props) {
  const { children } = props;

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default CustomThemeProvider;
