import React, {useContext, useState} from 'react';
import TransitionsModal from "../../UI/Modal/Modal";
import style from "./layout.module.css";
import settings from "../../../assets/images/settings.svg";
import Button from "../../UI/Button/Button";
import exit from '../../../assets/dashboard/exit.svg';
import user from '../../../assets/images/polzovatel.svg';
import close from "../../../assets/tables/close.svg";
import profileEdit from '../../../assets/images/edit_profile.svg';
import changePassword from '../../../assets/images/change_Password.svg'
import {Store} from "../../../Store";
import {useTranslation} from "react-i18next";

export default function Settings(props) {
   const {t} = useTranslation();
   const [open, setOpen] = useState(false);
   const {dispatch} = useContext(Store);

   const handleOpen = () => {
      setOpen(true);
   }
   const handleClose = () => {
      setOpen(false);
   };

   const handleLogOut = () => {
      localStorage.removeItem('id_token');
      return dispatch({type: 'SET_TOKEN', payload: ''})
   }

   return (
      <div>
         <Button btnType="vector" clicked={handleOpen}><img src={settings} alt=""/></Button>
         <TransitionsModal open={open} handleClose={handleClose}>
            <div className={style.tableModal}>
               <h3>{t('perSettings')}</h3>
               <img src={close} alt="" className={style.close} onClick={handleClose}/>
               <p><img src={user} alt=""/>{t('profile')}</p>
               <p><img src={profileEdit} alt=""/>{t('editProfile')}</p>
               <p><img src={changePassword} alt=""/>{t('changePassword')}</p>
               <p onClick={handleLogOut}><img src={exit} alt=""/>{t('signOut')}</p>
            </div>
         </TransitionsModal>
      </div>
   )
}