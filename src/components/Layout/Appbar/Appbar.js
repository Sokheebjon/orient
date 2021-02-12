import React, {useContext} from 'react'
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import ScrollMenu from "react-horizontal-scrolling-menu";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import AppBar from "@material-ui/core/AppBar";
import {faEuroSign, faYenSign} from "@fortawesome/free-solid-svg-icons";
import style from "./layout.module.css";
import {Store} from "../../../Store";
import Button from "../../UI/Button/Button";
import vectorR from "../../../assets/images/vectorRight.svg";
import vectorL from "../../../assets/images/vectorLeft.svg";
import sun from "../../../assets/images/sun.svg";
import leftLight from '../../../assets/images/leftLightAnchor.svg';
import rightDark from '../../../assets/images/rightDarkAnchor.svg';
import leftDark from '../../../assets/images/leftDarkAnchor.svg';
import Settings from "./Settings";
import {useTranslation} from "react-i18next";
import Activity from "../Activity/Activity.js";

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
   root: {
      display: 'flex',
   },
   appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
         easing: theme.transitions.easing.sharp,
         duration: theme.transitions.duration.leavingScreen,
      }),
      width: 'calc(100% - 110px)',
      height: 50,
      borderRadius: '10px 0px 10px 10px',
      boxShadow: 'none',
   },
   appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(99% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
         easing: theme.transitions.easing.sharp,
         duration: theme.transitions.duration.enteringScreen,
      }),
   },
   hide: {
      display: 'none',
   },
   toolbar: {
      top: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%'
   }
}));

export default function Appbar(props) {
   const {t} = useTranslation();
   const classes = useStyles();
   const {state, dispatch} = useContext(Store);

   const handleDrawerOpen = () => {
      props.setOpen(true);
   };
   const handleDrawerClose = () => {
      props.setOpen(false);
   };

   const handleChangeMode = () => {
      if (state.mode === 'dark') {
         return dispatch({type: 'MODE', payload: 'light'});
      } else {
         return dispatch({type: 'MODE', payload: 'dark'});
      }
   }

   const states = {
      dragging: true,
      alignCenter: true,
      wheel: false,
      hideSingleArrow: true,
      scrollToSelected: true,
      scrollBy: 2,
   }
   const data = [
      {
         name: '1JPY = 98.16',
         image: faYenSign,
      },
      {
         name: '1GBP = 98.16',
         image: faEuroSign,
      },
      {
         name: '1GBP = 98.16',
         image: faEuroSign,
      },
      {
         name: '1GBP = 98.16',
         image: faEuroSign,
      },
      {
         name: '1GBP = 98.16',
         image: faEuroSign,
      },
      {
         name: '1GBP = 98.16',
         image: faEuroSign,
      }
   ];

   return (
      <AppBar
         position="fixed"
         className={clsx([classes.appBar, "dark"].join(' '), {
            [classes.appBarShift]: props.open,
         })}
         id={state.mode}
      >
         <Toolbar className={classes.toolbar}>
            <div className={[classes.menuButton, style.vector].join(' ')}>
               {props.open === false ?
                  <div onClick={handleDrawerOpen}>
                     {state.mode === 'light' ? <img src={leftLight} alt=""/> : <img src={rightDark} alt=""/>}
                  </div>
                  :
                  <div onClick={handleDrawerClose}>
                     {state.mode === 'light' ? <img src={leftLight} alt=""/> : <img src={leftDark} alt=""/>}
                  </div>
               }
            </div>
            <div className={style.scroll}>
               <ScrollMenu
                  {...states}
                  arrowLeft={<div className={style.arrow}><img src={vectorR} alt=""/></div>}
                  arrowRight={<div className={style.arrow}><img src={vectorL} alt=""/></div>}
                  data={data.map((el, i) =>
                     <div className={style.scrollbar} key={i}>
                        <FontAwesomeIcon icon={el.image} size="lg"/><p>{el.name}</p>
                     </div>
                  )}
               />
            </div>
            <div className={style.sun}>
               <Button btnType="chat">{t('enterToChat')}</Button>
               <Button btnType="ndc">{t('calcNDS')}</Button>
               <Activity/>
               <Button btnType="vector" clicked={handleChangeMode}><img src={sun} alt=""/></Button>
               <Settings/>
            </div>
         </Toolbar>
      </AppBar>
   )
}