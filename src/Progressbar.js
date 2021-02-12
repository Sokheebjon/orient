import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import {useLocation} from 'react-router-dom';

const theme = createMuiTheme({
   palette: {
      primary: {
         main: '#fff',
      }
   }
})

const useStyles = makeStyles({
   root: {
      width: '100%',
      height: 1,
      position: 'absolute',
      zIndex: '100000',
      [theme.breakpoints.down(600)]: {
         position: 'fixed',
         top:0,
         zIndex: '10000'
      },
   },
   style: {
      backgroundColor: '#E7E7E7',
      color: '#FFD600',
   }
});

export default function Progressbar() {
   const classes = useStyles();
   const [progress, setProgress] = React.useState(0);
   let loc = useLocation();

   React.useEffect(() => {
      const timer = setInterval(() => {
         setProgress((oldProgress) => {
            if (oldProgress === 100) {
               return 0;
            }
            const diff = Math.random() * 100;
            return Math.min(oldProgress + diff, 100);
         });
      }, 1000);

      return () => {
         clearInterval(timer);
      };
   }, [loc.pathname]);

   return (
      <div className={classes.root}>
         <LinearProgress variant="determinate" value={progress} />
      </div>
   );
}