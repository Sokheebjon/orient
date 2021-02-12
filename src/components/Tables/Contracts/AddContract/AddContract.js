import React, {useContext, useEffect, useState} from 'react';
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useTranslation} from "react-i18next";
import {isEmpty} from 'lodash';
import style from "../../Applications/RecieveApplications/receiveApplications.module.css";
import TransitionsModal from "../../../UI/Modal/Modal";
import Button from "../../../UI/Button/Button";
import styles from "../../Applications/RecieveApplications/receiveApplications.module.css";
import {Store} from "../../../../Store";
import lupa from '../../../../assets/tables/lupa.svg';
import axios from "../../../../API/api";

const useStyles = makeStyles(theme => ({
   inputRoot: {
      color: '#fff',
      width: '100%',
      height: 35,
      fontFamily: "Montserrat",
      "& .MuiOutlinedInput-notchedOutline": {
         borderWidth: "1px",
         borderColor: "rgba(255, 255, 255, 1)",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
         borderWidth: "1px",
         borderColor: "#4B74FF",
      },
      "&.Mui-focused .MuiOutlinedInput": {
         borderWidth: "1px",
         borderColor: "#4B74FF"
      },
   },
   label: {
      fontSize: 12,
      color: '#fff'
   },
   progress: {
      Width: 10,
      margin: "auto"
   },
}));

export default function AddContract(props) {
   const classes = useStyles();
   const {t} = useTranslation();
   const [open, setOpen] = useState(false);
   const [inputs, setInputs] = useState({});
   const {state, dispatch} = useContext(Store);
   const [application, setApplication] = useState([]);
   const [currency, setCurrency] = useState([]);
   const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));
   const [loader, setLoader] = useState(false);
   const [supplier, setSupplier] = useState({});
   const [supplierLoader, setSupplierLoader] = useState(false);

   useEffect(() => {
      if (open === true) {
         Promise.all([
            axios.get(`/api/v1/application/${props.id}`, {headers: {Authorization: `Bearer ${state.token}`}}),
            axios.get(`/api/v1/types?typeCode=CURRENCY_TYPE`, {headers: {Authorization: `Bearer ${state.token}`}})
         ]).then(function (res) {
            const application = res[0];
            const currency = res[1];
            setApplication(application.data.data);
            setCurrency(currency.data.data);
            setLoader(true);
         }).catch((err) => {
            console.log(err.response)
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
      setSupplierLoader(false)
   };

   const handleInputChange = (event) => {
      event.persist();
      const name = event.target.name;
      setInputs(inputs => ({...inputs, [name]: event.target.value}));
      return dispatch({type: 'PAGE', payload: 0})
   }
   const handleInputComplete = (event, newValue, name) => {
      event.persist();
      if (name === 'productId') {
         setInputs(inputs => ({...inputs, ['pro']: newValue ? newValue.id : null}));
      } else if (name === 'builderOrganizationId') {
         setInputs(inputs => ({...inputs, ['bu']: newValue ? newValue.id : null}));
      } else if (name === 'payerOrganizationId') {
         setInputs(inputs => ({...inputs, ['pa']: newValue ? newValue.id : null}));
      }
      return dispatch({type: 'PAGE', payload: 0})
   }
   const getInn = (e) => {
      axios.get(`/api/v1/suppliers?supplierInn=${e}`, {headers: {Authorization: `Bearer ${state.token}`}})
         .then(res => {
            if (res.data.data.length !== 0) {
               setSupplier(res.data.data[0]);
            } else {
               setSupplier(res.data.data);
            }
            setSupplierLoader(true);
         })
         .catch(err => {
            console.log(err.response)
            if (err.response ? err.response.status === 401 : '') {
               localStorage.removeItem('id_token');
               return dispatch({type: 'SET_TOKEN', payload: ''})
            }
         })
   }

   const form = [
      {
         label: "Номер контракта",
         textArea: true,
         datePicker: false,
         name: 'applicationId',
         value: 'applicationId',
         xs: 3,
         xl: 3
      },
      {
         label: "Дата",
         textArea: true,
         datePicker: false,
         name: 'contractDate',
         value: 'contractDate',
         type: 'date',
         xs: 3,
         xl: 3
      },
      {
         label: "Тип валюты",
         textArea: false,
         datePicker: false,
         option: currency,
         name: 'currencyTypeId',
         value: 'currencyTypeId',
         xs: 3,
         xl: 3
      },
      {
         label: "Автор контракта",
         textArea: true,
         datePicker: false,
         name: 'authorName',
         value: 'authorName',
         xs: 3,
         xl: 3
      },
      {
         label: "Номер телефона",
         textArea: true,
         datePicker: false,
         name: 'contractNumber',
         value: 'contractNumber',
         xs: 3,
         xl: 3
      },
      {
         label: "Организация(Покупатель)",
         textArea: true,
         datePicker: false,
         name: 'builderOrganizationName',
         value: 'builderOrganizationName',
         disabled: true,
         xs: 3,
         xl: 3
      },
      {
         label: "Организация(Плательщик)",
         textArea: true,
         datePicker: false,
         name: 'payerOrganizationName',
         value: 'payerOrganizationName',
         disabled: true,
         xs: 3,
         xl: 3
      },
      {
         label: "ИНН(Поставщик)",
         textArea: true,
         datePicker: false,
         name: 'supplierInn',
         value: 'supplierInn',
         xs: 2,
         xl: 2
      },
   ]

   const user = [
      {
         label: "Организации(Постащик)",
         textArea: true,
         datePicker: false,
         name: 'organizationName',
         value: 'organizationName',
         disabled: true
      },
      {
         label: "ФИО(Поставщик)",
         textArea: true,
         datePicker: false,
         name: 'supplierName',
         value: 'supplierName'
      },
      {
         label: "Должность(Поставщик)",
         textArea: true,
         datePicker: false,
         name: 'supplierPosition',
         value: 'supplierPosition'
      },
      {
         label: "Номер телефона",
         textArea: true,
         datePicker: false,
         name: 'phoneNumber',
         value: 'phoneNumber'
      },
      {
         label: "Эл. Адрес",
         textArea: true,
         datePicker: false,
         name: 'email',
         value: 'email',
         disabled: true
      },
   ]

   return (
      <div>
         <Button btnType="addUser" clicked={handleOpen}>Добавить контракт</Button>
         <TransitionsModal open={open} handleClose={handleClose}>
            <div className={style.tableModal} style={{width: '80%', marginLeft: '10%'}}>
               <h3 className={styles.top}>Добавить контракт</h3>
               {loader === true ?
                  <Grid container className={styles.grid} spacing={2}>
                     {form.map((element, index) => (
                        <Grid item xs={element.xs} xl={element.xl} key={index}>
                           {element.textArea === false ?
                              <Autocomplete
                                 classes={classes}
                                 id="combo-box-demo"
                                 options={element.option}
                                 defaultValue={element.option.find(v => v.id === inputs[element.name])}
                                 getOptionLabel={(option) => option.name}
                                 onChange={(e, newValue) =>
                                    handleInputComplete(e, newValue, element.name)}
                                 renderInput={(params) => <TextField
                                    {...params} label={element.label} variant="outlined"
                                    InputLabelProps={{className: classes.label}}
                                    name={element.name}
                                    size="small"/>}
                              /> :
                              <TextField
                                 variant="outlined"
                                 size="small"
                                 name={element.name}
                                 type={element.type}
                                 value={inputs[element.value] || application[element.value]}
                                 onChange={handleInputChange}
                                 InputProps={{
                                    className: classes.label
                                 }}
                                 className={classes.inputRoot}
                                 label={element.label}
                                 InputLabelProps={{
                                    className: styles.label
                                 }}
                              />}
                        </Grid>
                     ))}
                     <Grid item xs={1} xl={1}>
                        <Button btnType="search" clicked={() => getInn(inputs.supplierInn)}>
                           <img src={lupa} alt=""/> Поиск</Button>
                     </Grid>
                  </Grid> : <CircularProgress size={30} className={classes.progress}/>}
               <hr className={style.br}/>
               {supplier && supplierLoader === true ?
                  <Grid container spacing={2}>
                     {user.map((element, index) => (
                        <Grid item xs={3} xl={3}>
                           <TextField
                              key={index}
                              variant="outlined"
                              size="small"
                              name={element.name}
                              type={element.name}
                              value={supplier[element.value] || null}
                              onChange={handleInputChange}
                              InputProps={{
                                 className: classes.label
                              }}
                              className={classes.inputRoot}
                              label={element.label}
                              InputLabelProps={{
                                 className: styles.label
                              }}
                              disabled={isEmpty(supplier) === false && element.disabled === true}
                           />
                        </Grid>
                     ))}
                  </Grid> : ''}
               <div className={style.action}>
                  <Button btnType="cancel" clicked={handleClose}>{t('cancel')}</Button>
                  <Button btnType="save">{t('save')}</Button>
               </div>
            </div>
         </TransitionsModal>
      </div>
   )
}