import { Box, Stack } from "@mui/material";

export const MuiResponsiveness = () => {
  return (
    <>
      <Stack direction={{ xs: "column", sm: "row" }}>
        <Box
          sx={{
            height: "300px",
            width: {
              xs: 100, //0
              sm: 200, //600
              md: 300, //900
              lg: 400, //1200
              xl: 500, //1536
            },
            bgcolor: "secondary.dark",
          }}
        ></Box>
        <Box>Hello</Box>
      </Stack>
    </>
  );
};
