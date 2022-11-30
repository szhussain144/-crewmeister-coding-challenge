import { Button, Theme } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { makeStyles, createStyles } from "@mui/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textArea: {
      background: "rgb(244, 67, 54)",
      fontSize: 14,
      margin: "0px 10px 0px 10px",
    },
  })
);
const DialogBox = (props:any) =>{
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  
  useEffect(()=>{
    setOpen(props?.props);
  });

  const handleClose = (confirmation:boolean) => {
    setOpen(false);
    props.getConfirmation(confirmation,note);
  };
    return (
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to complete your action?"}
        </DialogTitle>
        <DialogContent>
          <textarea rows={5} onChange={e=>setNote(e.target.value)}></textarea>
        </DialogContent>
        <DialogActions>
          <Button onClick={e=>handleClose(false)}>Cancel</Button>
          <Button onClick={e=>handleClose(true)} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )
}

export default DialogBox;