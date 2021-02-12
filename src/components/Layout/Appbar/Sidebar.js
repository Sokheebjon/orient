import React, {useContext, useEffect} from 'react';
import Drawer from "@material-ui/core/Drawer";
import clsx from "clsx";
import i18next from "i18next";
import {useTranslation} from "react-i18next";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import Collapse from '@material-ui/core/Collapse';
import ExpandMore from '@material-ui/icons/ExpandMore';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import {Link, useLocation, NavLink} from 'react-router-dom';
import style from "./layout.module.css";
import {Store} from '../../../Store';
import {SideData} from "./SidebarData";
import Button from "../../UI/Button/Button";
import logo from "../../../assets/images/logoBrand.svg";
import ows from "../../../assets/images/ows.svg";
import owsBlack from '../../../assets/images/owsBlack.svg';


const drawerWidth = 250;

const StyledBadge = withStyles((theme) => ({
   badge: {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
         position: 'absolute',
         top: -1,
         left: -1,
         width: '100%',
         height: '100%',
         borderRadius: '50%',
         animation: '$ripple 1.5s infinite ease-in-out',
         border: '1px solid currentColor',
         content: '""',
      },
   },
   '@keyframes ripple': {
      '0%': {
         transform: 'scale(.8)',
         opacity: 1,
      },
      '100%': {
         transform: 'scale(2.4)',
         opacity: 0,
      },
   },
}))(Badge);

const useStyles = makeStyles((theme, state) => ({
   drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
         easing: theme.transitions.easing.sharp,
         duration: theme.transitions.duration.enteringScreen,
      }),
      background: state => state.mode === 'dark'
         ? 'rgba(0, 0, 0, 0.5)' : "rgba(255, 255, 255, 0.5)",
      height: '100%'
   },
   drawerClose: {
      transition: theme.transitions.create('width', {
         easing: theme.transitions.easing.sharp,
         duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7) + 10,
      [theme.breakpoints.up('sm')]: {
         width: 95,
      },
      background: state => state.mode === 'dark'
         ? 'rgba(0, 0, 0, 0.5)' : "rgba(255, 255, 255, 0.5)",
   },
}));

export default function Sidebar(props) {
   const {state} = useContext(Store);
   const classes = useStyles(state);
   const {i18n} = useTranslation();
   const lang = i18n.language;
   const location = useLocation();
   const [openId, setOpen] = React.useState(false);
   const handleClick = (i) => {
      setOpen(openId === i ? -1 : i);
   };

   function handleChange(lang) {
      i18next.changeLanguage(lang)
      localStorage.setItem('lang', lang)
   }

   return (
      <Drawer
         variant="permanent"
         className={clsx(classes.drawer, {
            [classes.drawerOpen]: props.open,
            [classes.drawerClose]: !props.open,
         })}
         classes={{
            paper: clsx({
               [classes.drawerOpen]: props.open,
               [classes.drawerClose]: !props.open,
            }),
         }}
      >
         <div>
            <Link to="/dashboard">
               <div className={props.open === true ? style.mainOpen : style.mainClose}>
                  <img src={logo} alt="logo"/>
                  {state.mode === 'dark' ? <img src={ows} alt="ows"/> : <img src={owsBlack} alt=""/>}
               </div>
               {props.open === true ? <p className={style.ows}>ORIENT WEB SYSTEMS</p> : null}
            </Link>
         </div>
         <div className={style.user} style={props.open === false ? {paddingLeft: 26} : null}>
            <StyledBadge
               overlap="circle"
               anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
               }}
               variant="dot"
            >
               <Avatar alt="Remy Sharp"
                       src="https://image.shutterstock.com/image-vector/young-man-avatar-character-260nw-661669825.jpg"/>
            </StyledBadge>
            {props.open === true ?
               <div style={{marginTop: '-15px'}}>
                  <h5>Муйдинов Азизбек</h5>
                  <p>{i18n.t('systemAdmin')}</p>
               </div>
               : null}
         </div>
         <div className={style.lang}>
            {props.open === true ? <Button btnType="lang" clicked={() => handleChange('uz')}>
               <p style={lang === 'uz' ? {color: '#71B6DD'} : null}>UZ</p>
            </Button> : null}
            {props.open === true ? <Button btnType="lang" clicked={() =>   handleChange('ru')}>
                  <p style={lang === 'ru' ? {color: '#71B6DD'} : null}>RU</p>
               </Button> :
               <Button btnType="lang">
                  <p style={{color: '#71B6DD'}}>{lang.toUpperCase()}</p>
               </Button>
            }
            {props.open === true ? <Button btnType="lang" clicked={() => handleChange('en')}>
               <p style={lang === 'en' ? {color: '#71B6DD'} : null}>EN</p>
            </Button> : null}
         </div>
         {SideData.map((el, i) =>
            <div key={i}>
               <Link to={`/${el.link}`}>
                  <div
                     className={props.open === true ? [style.toolsOpen, location.pathname === el.active ? style.activeSide : null].join(' ')
                        : [style.toolsClose, location.pathname === '/' + el.link && openId === i ? style.activeSide : null].join(' ')}
                     onClick={() => handleClick(i)}>
                     <img src={el.img} alt=""/>
                     {props.open === true ?
                        <p>{i18n.language === "ru" ? el.name.ru : (i18n.language === "en" ? el.name.en : el.name.uz)}</p> : null}
                     <div className={style.anchor}>{props.open === true && el.nodes.length !== 0 ? (openId === i ?
                        <ExpandMore/> :
                        <KeyboardArrowRightIcon/>) : null}</div>
                  </div>
               </Link>
               <Collapse in={openId === i} timeout="auto" unmountOnExit>
                  {el.nodes.map((tree, i) =>
                     <Link to={`/${tree.link}`}>
                        <div
                           className={[style.nested, location.pathname === '/' + tree.link ? style.nestedActive : null].join(' ')}
                           key={i}>
                           <img src={tree.img} alt=""/>
                           <p>{i18n.language === "ru" ? tree.name.ru : (i18n.language === "en" ? tree.name.en : tree.name.uz)}</p>
                           <p className={(tree.badge !== null ? [style.badge] : null)}>{tree.badge}</p>
                        </div>
                     </Link>
                  )}
               </Collapse>
            </div>
         )}
      </Drawer>
   )

}
