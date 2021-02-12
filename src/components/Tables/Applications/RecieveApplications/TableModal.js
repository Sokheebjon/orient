import React, {useContext, useEffect, useState} from 'react';
import Button from "../../../UI/Button/Button";
import TransitionsModal from "../../../UI/Modal/Modal";
import Grid from "@material-ui/core/Grid";
import style from "./receiveApplications.module.css";
import close from '../../../../assets/tables/close.svg';
import logo from "../../../../assets/dashboard/logoCardBack.svg";
import {Store} from "../../../../Store";
import {useTranslation} from "react-i18next";
import phoneRing from "../../../../assets/tables/phone-ring.svg";
import emailIcon from "../../../../assets/tables/email.svg";
import axios from "../../../../API/api";

export default function ReceiveAppTableModal(props) {
   const [open, setOpen] = useState(false);
   const {state, dispatch} = useContext(Store);
   const [mainData, setMainData] = useState([]);
   const {t} = useTranslation();

   useEffect(() => {
      if (open === true) {
         axios.get(`/api/v1/user/${props.id}`, {headers: {Authorization: `Bearer ${state.token}`}})
            .then((res) => {
               setMainData(res.data.data)
            })
            .catch((err) => {
               console.log(err)
               if (err.response ? err.response.status === 401 : '') {
                  localStorage.removeItem('id_token');
                  return dispatch({type: 'SET_TOKEN', payload: ''})
               }
            })
      }
   }, [state.updated, props.id, open])

   const handleOpen = () => {
      setOpen(true);
   }

   const handleClose = () => {
      setOpen(false);
   };

   return (
      <div>
         <p onClick={handleOpen}>{props.label}</p>
         <TransitionsModal open={open} handleClose={handleClose}>
            <div className={style.tableModal}>
               <img src={logo} alt="" className={style.logo}/>
               <h3>{props.title}</h3>
               <img src={close} alt="" className={style.close} onClick={handleClose}/>
               <Grid container spacing={3}>
                  <Grid item xl={4} xs={4} className={style.modalData}>
                     <img className={style.userImage} src={props.img} alt=""/>
                  </Grid>
                  <Grid item xl={8} xs={8} className={style.modalData}>
                     <p>Ф.И.О: {mainData.firstName} {mainData.lastName} {mainData.middleName}</p>
                     <p>{t('position')}: {mainData.positionTypeName}</p>
                     {mainData.contacts ? mainData.contacts.map((e, i) =>
                        <div key={i}>
                           <div className={style.modalInfo}>
                              <img src={phoneRing} alt=""/>
                              <p className={style.emailText}
                                 style={{marginRight: 90}}>{t('telNum')}: {e.phoneNumber}</p>
                           </div>
                           <div className={style.modalInfo}>
                              <img src={emailIcon} alt=""/>
                              <p className={style.emailText} style={{marginRight: 90}}>{t('emailAdd')}: {e.email}</p>
                           </div>
                        </div>
                     ) : ''}
                  </Grid>
               </Grid>
            </div>
         </TransitionsModal>
      </div>
   )
}

