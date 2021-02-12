import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import style from './auth.module.css';
import ows from '../assets/images/ows.svg';
import logo from '../assets/images/logoBrand.svg';
import Form from "../components/Form/Form";
import Snackbar from "../components/UI/Snackbar/Snackbar";

function Copyright() {
   return (
      <Typography variant="body2" color="white" align="right">
         <div style={{color: '#fff', position: 'absolute', bottom: 50, right: 50, fontSize: 12}}>
            По вопросам поддержки обращаться по номеру:
            <br/>
            +998 99 321-32-32
         </div>
         {/*{new Date().getFullYear()}*/}
         {/*{'.'}*/}
      </Typography>
   );
}

const useStyles = makeStyles((theme) => ({
   paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'rgba(0, 0, 0, 0.5)',
      padding: 30,
      borderRadius: 10,
      backdropFilter: 'blur(8px)',
      width: 328,
      height: 374,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      margin: 'auto',
   },
   avatar: {
      margin: theme.spacing(1),
      display: "flex",
      alignItems: 'center',
      justifyContent: 'space-between'
   },
   form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(2),
   },
   ows: {
      fontFamily: 'Orbitron, sans-serif',
      fontSize: 10,
      color: '#fff',
      letterSpacing: '0.345em'
   },
}));

export default function Login() {
   const classes = useStyles();

   const inputForm = [
      {
         label: 'Логин',
         variant: 'outlined',
         name: 'login',
         value: 'login',
         required: true
      },
      {
         label: 'Пароль',
         variant: 'outlined',
         name: 'password',
         value: 'password',
         required: true
      }
   ]

   return (
      <div className={style.background}>
         <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
               <div className={classes.avatar}>
                  <img src={logo} alt="" className={style.logo}/> <img src={ows} alt=""/>
               </div>
               <div className={classes.ows}>
                  ORIENT WEB SYSTEMS
               </div>
               <Form inputForm={inputForm} url={'/api/v1/auth/login'} type={'auth'}/>
            </div>
            <Box mt={8}>
               <Copyright/>
            </Box>
         </Container>
      </div>
   )
}