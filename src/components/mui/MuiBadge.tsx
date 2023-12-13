import { Stack, Badge } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";

export const MuiBadge = () => {
  let visible = true;
  return (
    <Stack mt={2} spacing={2} direction="row">
      <Badge badgeContent={5} color="secondary">
        <MailIcon />
      </Badge>

      <Badge badgeContent={0} color="secondary" showZero>
        <MailIcon />
      </Badge>

      <Badge badgeContent={1000} color="secondary" max={999}>
        <MailIcon />
      </Badge>

      <Badge color="secondary" variant="dot">
        <MailIcon />
      </Badge>

      <Badge color="secondary" variant="dot" invisible={visible}>
        <MailIcon />
      </Badge>
    </Stack>
  );
};
