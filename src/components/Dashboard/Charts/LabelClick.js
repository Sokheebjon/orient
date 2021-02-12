import React from "react";
import DataSet from '@antv/data-set';
import {
   G2,
   Chart,
   Tooltip,
   Interval,
   Coord,
   Coordinate
} from "bizcharts";
import GlobalChart from "./Chart";
import {useTranslation} from "react-i18next";

const data = [
   {country: 'Europe', year: '1750', value: 502},
   {country: 'Europe', year: '1800', value: 635},
   {country: 'Europe', year: '1850', value: 809},
   {country: 'Europe', year: '1900', value: 947},
   {country: 'Europe', year: '1950', value: 1402},
   {country: 'Europe', year: '1999', value: 3634},
   {country: 'Europe', year: '2050', value: 5268},
   {country: 'Europe', year: '2100', value: 7268},
   {country: 'Asia', year: '1750', value: 163},
   {country: 'Asia', year: '1800', value: 203},
   {country: 'Asia', year: '1850', value: 276},
   {country: 'Asia', year: '1900', value: 408},
   {country: 'Asia', year: '1950', value: 547},
   {country: 'Asia', year: '1999', value: 729},
   {country: 'Asia', year: '2050', value: 628},
   {country: 'Asia', year: '2100', value: 828},
];

export default function labelClick() {
   // eslint-disable-next-line react-hooks/rules-of-hooks
   const {t} = useTranslation();
   const ds = new DataSet();
   const dv = ds
      .createView()
      .source(data)
      .transform({
         type: 'percent',
         field: 'value', // 统计销量
         dimension: 'country', // 每年的占比
         groupBy: ['year'], // 以不同产品类别为分组
         as: 'percent',
      });
   return (
      <div>
         <p>{t('monthlyExpanses')}</p>
         <GlobalChart
            padding="auto"
            scale={{
               percent: {
                  min: 0,
                  formatter(val) {
                     return (val * 100).toFixed(2) + '%';
                  },
               }
            }}
            data={dv.rows}
            autoFit
         >
            <Coordinate transpose/>
            <Interval
               // color="white"
               adjust="stack"
               color="white"
               position="year*percent"
            />
            <Interval
               color="#FF1400"
               position="year*percent"
            />
            <Tooltip shared/>
         </GlobalChart>
      </div>
   );
}