import React from 'react';
import {Grid} from "@material-ui/core";
import Category from "./Category/Category";
import Line from "./Charts/LineAdvance";
import Grouped from "./Charts/Grouped";
import PieChart from "./Charts/PieChart";
import LabelLine from "./Charts/LabelLine";
import LabelClick from "./Charts/LabelClick";
import Graph from "./Charts/Graph";
import style from './dashboard.module.css';

export default function Dashboard() {

   return (
      <div className={style.dashboard}>
         <Category/>
         <div className={style.chart}>
            <Grid container>
               <Grid item xs={6} xl={4}>
                  <div className={style.chartComponent}>
                     <Line/>
                  </div>
               </Grid>
               <Grid item xs={6} xl={4}>
                  <div className={style.chartComponent}>
                     <PieChart/>
                  </div>
               </Grid>
               <Grid item xs={6} xl={4}>
                  <div className={style.chartComponent}>
                     <LabelLine/>
                  </div>
               </Grid>
               <Grid item xs={6} xl={4}>
                  <div className={style.chartComponent}>
                     <Grouped/>
                  </div>
               </Grid>
               <Grid item xs={6} xl={4}>
                  <div className={style.chartComponent}>
                    <LabelClick/>
                  </div>
               </Grid>
               <Grid item xs={6} xl={4}>
                  <div className={style.chartComponent}>
                     <Graph/>
                  </div>
               </Grid>
            </Grid>
         </div>
      </div>
   )
}