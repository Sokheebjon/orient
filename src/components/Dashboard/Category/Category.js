import React from 'react';
import ScrollMenu from "react-horizontal-scrolling-menu";
import style from "./category.module.css";
import {Data} from './CategoryData';
import CountUp from "react-countup";
import logo from '../../../assets/dashboard/logoCardBack.svg';

export default function Dashboard() {

   const states = {
      dragging: true,
      scrollBy: 2,
      arrowLeft: false,
      arrowRight: false,
      alignCenter: false
   }

   return (

      <div className={style.scroll}>
         <ScrollMenu
            {...states}
            data={Data.map((el, i) =>
               <div className={style.scrollbar} key={i}>
                  <img src={logo} alt="" className={style.back}/>
                  <div>
                     <h1><CountUp end={el.amount} duration={5}/></h1>
                     <h2>{el.name}</h2>
                  </div>
                  <img src={el.img} alt=""/>
               </div>
            )}
         />
      </div>

   )
}