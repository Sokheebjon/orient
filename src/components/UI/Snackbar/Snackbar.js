import React, {useContext, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import {SnackbarProvider, useSnackbar} from 'notistack';
import {Store} from "../../../Store";

function MyApp(props) {
   const {enqueueSnackbar} = useSnackbar();
   const {state, dispatch} = useContext(Store);

   const handleClick = () => {
      enqueueSnackbar('I love snacks.');
   };

   const handleClickVariant = (variant) => () => {
      // variant could be success, error, warning, info, or default
      enqueueSnackbar('This is a success message!', {variant});
   };

   handleClickVariant()
   return (
      <div />
   );
}

export default function Snackbar(props) {
   const {state, dispatch} = useContext(Store)
   useEffect(() => {
      console.log(state.snackbar)
      return <MyApp />
   }, [state.snackbar])
   return (
      <SnackbarProvider maxSnack={3} anchorOrigin={{vertical: 'top', horizontal: 'right'}}>
         <MyApp {...props}/>
      </SnackbarProvider>
   );
}