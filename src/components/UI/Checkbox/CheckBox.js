import React from 'react';
import style from './checkbox.module.css';

export default function CheckBox(props) {
   if (props.row) {
      console.log(props.row)
   }
   return (
      <div>
         <p className={style.header}>{props.header}</p>
         <input type="checkbox" name={props.name} checked={props.checked} onChange={props.onChange}
                onClick={props.onClick}/>
         <label>{props.label}</label>
      </div>
   )
}