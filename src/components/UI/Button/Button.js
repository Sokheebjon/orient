import React from 'react';
import styles from './button.module.css';

export default function Button(props) {
   return (
      <button
         disabled={props.disabled}
         className={[styles.Button, styles[props.btnType]].join(' ')}
         onClick={props.clicked}
         style={props.style}
         type={props.type}
      >
         {props.children}
      </button>
   )
}