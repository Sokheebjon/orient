import React from "react";
import {PieChart} from "bizcharts";
import GlobalChart from "./Chart";
import './chart.module.css';


import {
   Chart,
   registerShape,
   Geom,
   Axis,
   Tooltip,
   Interval,
   Interaction,
   Coordinate,
} from "bizcharts"
import {useTranslation} from "react-i18next";

const data = [
   {
      type: "Yangi Zamon",
      value: 20
   },
   {
      type: "GDF",
      value: 18
   },
   {
      type: "Binokor",
      value: 32
   },
   {
      type: "Golden House",
      value: 15
   },


];
const sliceNumber = 0.01;

registerShape("interval", "sliceShape", {
   draw(cfg, container) {
      const points = cfg.points;
      let path = [];
      path.push(["M", points[0].x, points[0].y]);
      path.push(["L", points[1].x, points[1].y - sliceNumber]);
      path.push(["L", points[2].x, points[2].y - sliceNumber]);
      path.push(["L", points[3].x, points[3].y]);
      path.push("Z");
      path = this.parsePath(path);
      return container.addShape("path", {
         attrs: {
            fill: cfg.color,
            path: path
         }

      });
   }
});

export default function Pie() {
   const {t} = useTranslation();
   return (
      <div>
         <p>{t('highCostManage')}</p>
         <GlobalChart data={data} height={500} autoFit>
            <Coordinate type="theta" radius={0.8} innerRadius={0.75}/>
            <Axis visible={false}/>
            <Tooltip showTitle={false}/>
            <Interval
               adjust="stack"
               position="value"
               color="type"
               shape="sliceShape"
            />
            <Interaction type="element-single-selected"/>
         </GlobalChart>
      </div>
   )
}