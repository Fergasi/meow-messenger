import { Box } from "@mui/material";
import Header from "./Header";
import catPaper from "../../assets/uiBackground.png";

function Layout(props) {
  const { children } = props;

  return (
    <Box display='flex' flexDirection='column' minHeight='100vh'>
      <Box
        flexGrow={1}
        sx={{
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            backgroundImage: `url(${catPaper})`,
            backgroundSize: "cover",
            opacity: "0.3",
            position: "absolute",
            left: "0px",
            top: "0px",
            bottom: "0px",
            right: "0px",
            // width: "100%",
            // height: "auto",
          }}
        ></Box>

        <Box sx={{ position: "relative" }}>{children}</Box>
      </Box>
    </Box>
  );
}

export default Layout;
