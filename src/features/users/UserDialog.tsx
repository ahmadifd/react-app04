import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FC } from "react";

interface IProps {
  userDialogTitle: string;
  setShowUserDialog: React.Dispatch<React.SetStateAction<boolean>>;
  showUserDialog: boolean;
}

const UserDialog: FC<IProps> = ({
  setShowUserDialog,
  showUserDialog,
  userDialogTitle,
}) => {
  return (
    <>
      <Dialog open={showUserDialog}>
        <DialogTitle>{userDialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowUserDialog(false);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserDialog;
