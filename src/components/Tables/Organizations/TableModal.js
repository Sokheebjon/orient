import React, {useContext, useEffect, useState} from 'react'
import TransitionsModal from "../../UI/Modal/Modal";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import logo from "../../../assets/dashboard/logoCardBack.svg";
import style from "./org.module.css";
import close from "../../../assets/tables/close.svg";
import Button from "../../UI/Button/Button";
import emailIcon from "../../../assets/tables/email.svg"
import phoneRing from "../../../assets/tables/phone-ring.svg"
import {useTranslation} from "react-i18next";
import axios from "../../../API/api";
import {Store} from "../../../Store";
import StaticMap from "../Map/StaticMap";

export default function TableModalOrg(props) {
   const {t} = useTranslation();
   const [open, setOpen] = useState(false);
   const {state, dispatch} = useContext(Store);
   const [mainData, setMainData] = useState([]);

   useEffect(() => {
      if (props.id && open === true) {
         axios.get(`/api/v1/users?organizationId=${props.id}`, {headers: {Authorization: `Bearer ${state.token}`}})
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
   }, [state.updated, open, props.id])

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

   const handleOpen = () => {
      setOpen(true);
   }
   const handleClose = () => {
      setOpen(false);
   };

   return (
      <div>
         <img src={props.img} alt="" onClick={handleOpen}/>
         <TransitionsModal open={open} handleClose={handleClose}>
            <div className={style.tableModal}>
               <h3>{props.title}</h3>
               <img src={close} alt="" className={style.close} onClick={handleClose}/>
               {props.data === 'delete' ?
                  <div>
                     <Button btnType="save" clicked={(e) => handleDelete(props.deleteId)}>{t('yes')}</Button>
                     <Button btnType="cancel" clicked={handleClose}>{t('no')}</Button>
                  </div>
                  :
                  <Grid container className={style.gridContainer}>
                     {props.users === 'users' && mainData ? mainData.map(data => (
                        <Grid item xs={6} xl={6}>
                           <div className={style.grid}>
                              <img width="auto" height="auto" src={logo} alt="" className={style.logo}/>
                              <p>{data.positionTypeName}</p>
                              <h4>{data.firstName}</h4>
                              {data.contacts ? data.contacts.map(c =>
                                 <div>
                                    <div className={style.userData}>
                                       <img src={emailIcon} alt=""/>
                                       <p> {t('emailAdd')}: {c.email}</p>
                                    </div>
                                    <div className={style.userData}>
                                       <img src={phoneRing} alt=""/>
                                       <p>{t('telNum')}: {c.phoneNumber}</p>
                                    </div>
                                 </div>
                              ) : ''}
                           </div>
                        </Grid>
                     )) : (props.users === 'number' && props.data ? props.data.map(d =>
                        <div className={style.userData}>
                           <p><img src={props.icon} alt=""/> {d.phoneNumber}</p>
                           {/*<p style={{marginRight: 90}}>{d.time}</p>*/}
                           {/*<p style={{marginRight: 90}}>{d.action}</p>*/}
                        </div>
                     ) : (props.users === 'email' && props.data ? props.data.map(c =>
                        <div className={style.userData}>
                           <p><img src={emailIcon} alt=""/> {c.email}</p>
                        </div>
                     ) : (props.users === 'map' && props.data ? props.data.map(m =>
                              <StaticMap data={m} height={120}/>)
                           :
                           <div>
                              <Button btnType="save">{t('yes')}</Button>
                              <Button btnType="cancel" clicked={handleClose}>{t('no')}</Button>
                           </div>
                     )))}
                     <div className={style.modalContacts}>
                        {props.actions ? props.actions.map(e =>
                           <img src={e.img} alt=""/>
                        ) : null}
                     </div>
                  </Grid>
               }
            </div>
         </TransitionsModal>
      </div>
   )
}