import React from 'react';
import ReactDOM from 'react-dom';
import {PieChart} from 'bizcharts';
import GlobalChart from "./Chart";
import style from './chart.module.css'
import {useTranslation} from "react-i18next";

const data = [
   {
      type: 'Makro',
      value: 27,
   },
   {
      type: 'OFB',
      value: 25,
   },
   {
      type: 'Golden House',
      value: 18,
   },
   {
      type: 'Binokor',
      value: 15,
   },

];

export default function LabelLine() {
   const {t} = useTranslation();
   return (
      <div className={style.pieChart}>
         <p>{t('mostOrganizeVend')}</p>
         <PieChart
            data={data}
            title={{
               visible: true,
            }}
            description={{
               visible: true,
            }}
            radius={0.7}
            angleField='value'
            colorField='type'
            label={{
               visible: true,
               type: 'inner',
            }}
         />
      </div>
   );
}
