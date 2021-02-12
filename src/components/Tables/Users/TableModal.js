import React, {useContext, useState, useEffect} from 'react';
import Button from "../../UI/Button/Button";
import TransitionsModal from "../../UI/Modal/Modal";
import style from "./users.module.css";
import close from '../../../assets/tables/close.svg';
import logo from '../../../assets/dashboard/logoCardBack.svg';
import {useTranslation} from "react-i18next";
import axios from "../../../API/api";
import {Store} from "../../../Store";

export default function TableModal(props) {
   const {t} = useTranslation();
   const [open, setOpen] = useState(false);
   const {state, dispatch} = useContext(Store);

   // useEffect(() => {
   //    if (props.id) {
   //       axios.get()
   //    }
   // }, [])

   const handleOpen = () => {
      setOpen(true);
   }

   const handleClose = () => {
      setOpen(false);
   };

   const handleDelete = (e) => {
      axios.delete(props.url + `${'/' + e}`, {headers: {Authorization: `Bearer ${state.token}`}})
         .then(response => {
            console.log(response)
            if (response.status === 201 || 200) {
               handleClose()
               return dispatch({type: 'UPDATED', payload: Math.random()})
            }
         })
         .catch(error => {
            console.log(error)
         })
   }

   return (
      <div>
         <img src={props.img} alt="" onClick={handleOpen}/>
         <TransitionsModal open={open} handleClose={handleClose}>
            <div className={style.tableModal}>
               <img src={logo} alt="" className={style.logo}/>
               <h3>{props.title}</h3>
               <img src={close} alt="" className={style.close} onClick={handleClose}/>
               {props.data !== 'delete' && props.data ? props.data.map(d =>
                     <div className={style.modalData}>
                        <img src={props.icon} alt=""/>
                        <p>{d.data}</p>
                        <p style={{marginRight: 90}}>{d.time}</p>
                        <p style={{marginRight: 90}}>{d.action}</p>
                     </div>) :
                  <div>
                     <Button btnType="save" clicked={(e) => handleDelete(props.deleteId)}>{t('yes')}</Button>
                     <Button btnType="cancel" clicked={handleClose}>{t('no')}</Button>
                  </div>
               }
               <div className={style.modalContacts}>
                  {props.actions ? props.actions.map(e =>
                     <img src={e.img} alt=""/>
                  ) : ''}
               </div>
            </div>
         </TransitionsModal>
      </div>
   )
}