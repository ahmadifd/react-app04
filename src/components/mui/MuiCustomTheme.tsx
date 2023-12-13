import { Box, styled } from "@mui/material";
import { createTheme, ThemeProvider, colors } from "@mui/material";

const StyledBox = styled(Box)(({ theme }) => ({
  height: "250px",
  width: "250px",
  backgroundColor: theme.palette.neutral?.darker
  //theme.status.danger,
}));

export const MuiCustomTheme = () => {
  const theme = createTheme({
    status: {
      danger: "#e53e3e",
    },
    palette: {
      secondary: {
        main: colors.orange[500],
        dark: colors.grey[700],
      },
      neutral: {
        main: colors.grey[500],
        darker: colors.grey[400],
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <StyledBox></StyledBox>
      </ThemeProvider>
    </>
  );
};
