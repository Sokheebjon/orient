import React from 'react';
import {Chart} from 'bizcharts';

export default function GlobalChart(props) {
   return (
      <Chart padding={[5, 20, 50, 40]} autoFit height={320} data={props.data}>
         {props.children}
      </Chart>
   )
}