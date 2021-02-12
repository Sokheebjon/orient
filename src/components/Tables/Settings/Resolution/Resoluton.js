import React, {useContext, useEffect, useState} from 'react';
import TextField from '@material-ui/core/TextField';
import style from "./resolution.module.css";
import Table from "../../Table";
import CheckBox from "../../../UI/Checkbox/CheckBox";
import {makeStyles} from "@material-ui/core/styles";
import axios from "../../../../API/api";
import {Store} from "../../../../Store";
import ResolutionTable from "./ResoltionTable";

export default function Role() {

   return (
      <div className={style.main}>
         <div className={style.top}>
            <p>Доступ</p>
         </div>
         <ResolutionTable />
      </div>
   )
}