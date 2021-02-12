import React from 'react';
import ReactDOM from 'react-dom';
import {Chart, LineAdvance} from 'bizcharts'
import GlobalChart from "./Chart";
import {useTranslation} from "react-i18next";


const data = [

   {
      month: "Jan",
      city: "London",
      temperature: 30
   },
   {
      month: "Feb",
      city: "London",
      temperature: 45
   },

   {
      month: "Mar",
      city: "London",
      temperature: 65
   },
   {
      month: "Apr",
      city: "London",
      temperature: 80
   },
   {
      month: "May",
      city: "London",
      temperature: 75
   },

   {
      month: "June",
      city: "London",
      temperature: 40
   },

   {
      month: "July",
      city: "London",
      temperature: 43
   },

   {
      month: "Aug",
      city: "London",
      temperature: 60
   },

   {
      month: "Sept",
      city: "London",
      temperature: 43
   },

   {
      month: "Oct",
      city: "London",
      temperature: 40
   },

   {
      month: "Nov",
      city: "London",
      temperature: 50
   },
   {
      month: "Dec",
      city: "London",
      temperature: 65
   },
];

export default function Graph() {
   const {t} = useTranslation();
   return (
      <div>
         <p>{t('equipCostOneYear')}</p>
         <GlobalChart autoFit data={data}>
            <LineAdvance
               shape="smooth"
               point
               area
               position="month*temperature"
               color="#29E947"
            />
         </GlobalChart>
      </div>
   )
}
