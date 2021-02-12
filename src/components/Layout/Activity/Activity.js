import React from "react";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "../../UI/Button/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";
import styles from "./Activity.module.css"


const useStyles = makeStyles({
   list: {
      width: 300,
      backgroundColor: "#000000",
      height: "100%",
      color: "white",
   },
   ListItem: {
      width: "100%"
   },
   fullList: {
      width: "auto"
   },
   drawerPaper: {
      marginTop: 54
   }
});

let fullDate = new Date(),
   date = fullDate.getDate() + "." + (fullDate.getMonth() + "." + fullDate.getFullYear() + "  at " + fullDate.getHours() + ":" + fullDate.getMinutes());


export default function TemporaryDrawer() {
   const classes = useStyles();
   const [state, setState] = React.useState(false);

   const toggleDrawer = (side, open) => (event) => {
      setState(!state);
   };

   const list = () => (
      <div
         className={clsx(classes.list)}
         role="presentation"
      >
         <List>
            <ListItem className={clsx(classes.ListItem)}>
               <h3>Activity</h3>
               <IconButton className={styles.activity} aria-label="delete">
                  <CloseIcon onClick={toggleDrawer(false)} className={styles.close}/>
               </IconButton>
            </ListItem>
         </List>
         <Divider className={styles.divider}/>
         <List>
            {ListData.map((text, index) => (
               <ListItem className={styles.listItem} button key={text}>
                  <div className={styles.listItemText}>
                     <img className={styles.avatar} src="https://image.shutterstock.com/image-vector/young-man-avatar-character-260nw-661669825.jpg" alt=""/>
                     <p className={styles.text}>{text.data}</p>
                  </div>
                  <small className={styles.time}>{text.time}</small>
               </ListItem>
            ))}
         </List>
      </div>
   );

   return (
      <div>
         <React.Fragment>
            <Button btnType="activity" clicked={toggleDrawer('right', true)}>Activity</Button>
            <Drawer
               anchor={"right"}
               open={state}
               onClose={toggleDrawer("right", true)}
               classes={{
                  paper: classes.drawerPaper
               }}
            >
               {list("right")}
            </Drawer>
         </React.Fragment>
      </div>
   );
}

const ListData = [
   {
      data: "Eshmat's application is not confirmed.",
      time: date
   },
   {
      data: "G'ishmat's application was confirmed.",
      time: date
   }
]
