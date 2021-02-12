import React, {useState, useEffect, useContext} from 'react';
import Button from "../../UI/Button/Button";
import TransitionsModal from "../../UI/Modal/Modal";
import style from "../Users/users.module.css";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import YandexMap from "../Map/Map";
import {useTranslation} from "react-i18next";
import axios from '../../../API/api';
import {Store} from "../../../Store";
import CircularProgress from "@material-ui/core/CircularProgress";
import {toast} from "react-toastify";

const useStyles = makeStyles(theme => ({
   inputRoot: {
      fontSize: 12,
      width: "100%",
      color: '#fff',
      minHeight: 40,
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
   input: {
      color: '#fff',
      fontSize: 13
   },
   label: {
      color: '#fff',
      fontSize: 13
   },
}));

export default function AddOrg(props) {
   const {t} = useTranslation();
   const classes = useStyles();
   const {state, dispatch} = useContext(Store);
   const [open, setOpen] = useState(false);
   const [mfo, setMfo] = useState(props.updated === true && props.updateInfo.mfos.length !== 0 ? props.updateInfo.mfos : [{mfo: ''}]);
   const [account, setAccount] = useState(props.updated === true && props.updateInfo.paymentAccounts.length !== 0 ? props.updateInfo.paymentAccounts : [{account: ''}]);
   const [address, setAddress] = useState(props.updated === true && props.updateInfo.addresses.length !== 0 ? props.updateInfo.addresses : [{
      name: '',
      latitude: '49',
      longitude: '61'
   }]);
   const [contact, setContact] = useState(props.updated === true && props.updateInfo.contacts.length !== 0 ? props.updateInfo.contacts : [{
      email: '',
      phoneNumber: ''
   }]);
   const [bDirection, setBdirection] = useState([]);
   const [financier, setFinancier] = useState([]);
   const [inputs, setInputs] = useState(props.updated === true ? props.updateInfo : {});
   const [data, setData] = useState('');
   const [loader, setLoader] = useState(false);

   useEffect(() => {
      if (open === true) {
         Promise.all([
            axios.get(`/api/v1/business/directions`, {headers: {Authorization: `Bearer ${state.token}`}}),
            axios.get(`/api/v1/users?isFinancier=true`, {headers: {Authorization: `Bearer ${state.token}`}})
         ]).then(function (results) {
            const bussiness = results[0];
            const financier = results[1];
            setBdirection(bussiness.data.data);
            setFinancier(financier.data.data);
            setLoader(true)
         }).catch((err) => {
            console.log(err)
            if (err.response ? err.response.status === 401 : '') {
               localStorage.removeItem('id_token');
               return dispatch({type: 'SET_TOKEN', payload: ''})
            }
         })
      }
   }, [state.updated, open])

   function handleAddMfo() {
      setMfo([...mfo, {mfo: ''}]);
   }

   function handleRemoveMfo(i) {
      const list = [...mfo];
      list.splice(i, 1);
      setMfo(list);
   }

   function handleAddAccount() {
      setAccount([...account, {account: ''}]);
   }

   function handleRemoveAccount(i) {
      const list = [...account];
      list.splice(i, 1);
      setAccount(list);
   }

   function handleAddAddress() {
      setAddress([...address, {name: '', latitude: '41', longitude: '69'}]);
   }

   function handleRemoveAddress(i) {
      const list = [...address];
      list.splice(i, 1);
      setAddress(list);
   }

   function handleAddContact() {
      setContact([...contact, {email: '', phoneNumber: ''}]);
   }

   function handleRemoveContact(i) {
      const list = [...contact];
      list.splice(i, 1);
      setContact(list);
   }

   const handleOpen = () => {
      setOpen(true);
   }

   const handleClose = () => {
      setOpen(false);
   };

   const handleInputChange = (event, i, state) => {
      event.persist();
      const {name, value} = event.target;
      if (state === 'mfo') {
         const list = [...mfo];
         list[i][name] = value;
         setMfo(list);
      } else if (state === 'account') {
         const list = [...account];
         list[i][name] = value;
         setAccount(list);
      } else if (state === 'address') {
         const list = [...address];
         list[i][name] = value;
         setAddress(list);
      } else if (state === 'contact') {
         const list = [...contact];
         list[i][name] = value;
         setContact(list);
      } else if (state === 'addOrg') {
         setInputs(inputs => ({...inputs, [name]: event.target.value}));
      }
   }
   const handleInputComplete = (event, newValue, name) => {
      event.persist();
      setInputs(inputs => ({...inputs, [name]: event.target.innerText}));
      if (name === 'financierUserId' && newValue) {
         setInputs(inputs => ({...inputs, 'financierUserId': newValue.id}))
      } else if (name === 'businessDirectionId' && newValue) {
         setInputs(inputs => ({...inputs, 'businessDirectionId': newValue.id}))
      }
   }

   const handleSubmitSingle = (e) => {
      e.preventDefault();
      let data = {
         "addresses": address,
         "businessDirectionId": inputs.businessDirectionId,
         "contacts": contact,
         "financierUserId": inputs.financierUserId,
         "forObjectName": true,
         "inn": inputs.inn,
         "mfos": mfo,
         "name": inputs.name,
         "nick": inputs.nick,
         "paymentAccounts": account
      }
      let update = {
         "id": props.updated === true ? props.updateInfo.id : '',
         "addresses": address,
         "businessDirectionId": inputs.businessDirectionId,
         "contacts": contact,
         "financierUserId": inputs.financierUserId,
         "forObjectName": true,
         "inn": inputs.inn,
         "mfos": mfo,
         "name": inputs.name,
         "nick": inputs.nick,
         "paymentAccounts": account
      }
      axios[props.updated === true ? 'put' : 'post'](props.updated === true ? props.updatedUrl : `/api/v1/organization/create`,
         props.updated === true ? update : data, {headers: {Authorization: `Bearer ${state.token}`}})
         .then(response => {
            console.log(response)
            toast.configure();
            toast.success(('Добавлена новая оранизация'), {
               position: "top-right",
               autoClose: 3000,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
            });
            if (response.status === 201 || 200) {
               handleClose()
               return dispatch({type: 'UPDATED', payload: Math.random()})
            }
         })
         .catch(function (error) {
            const err = error.response.data.error
            toast.configure();
            toast.error((err.friendlyMessage ? err.friendlyMessage : err), {
               position: "top-right",
               autoClose: 3000,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
            });
         })
   }
   const form = [
      {
         label: t('orgName'),
         variant: 'outlined',
         name: 'name',
         value: 'name',
         textArea: true,
         nested: false
      },
      {
         label: t('orgCode'),
         variant: 'outlined',
         name: 'nick',
         value: 'nick',
         textArea: true,
         nested: false
      },
      {
         label: t('businessDirection'),
         variant: 'outlined',
         name: 'businessDirectionId',
         value: 'businessDirectionId',
         textArea: false,
         nested: false,
         option: bDirection,
         optionName: 'name'
      },
      {
         label: t('inn'),
         variant: 'outlined',
         name: 'inn',
         value: 'inn',
         textArea: true,
         nested: false,
      },
      {
         label: t('financier'),
         variant: 'outlined',
         name: 'financierUserId',
         value: 'financierUserId',
         textArea: false,
         nested: false,
         option: financier,
         optionName: 'shortName'
      },
   ]
   // console.log(inputs)
   return (
      <div>
         {props.img ? <img src={props.img} alt="" onClick={handleOpen}/> :
            <Button btnType="addUser" clicked={handleOpen}>{t('add')}</Button>}
         <TransitionsModal open={open} handleClose={handleClose}>
            <div className={style.modal} onSubmit={handleSubmitSingle}>
               {loader === true ?
                  <div>
                     <p>{t('addOrg')}</p>
                     <Grid className={style.form} container spacing={3}>
                        {form.map((element, i) =>
                           <Grid item xs={3} xl={3}>
                              {element.textArea === true ?
                                 <TextField
                                    key={i}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                       className: classes.multilineColor
                                    }}
                                    className={classes.inputRoot}
                                    name={element.name}
                                    type={element.name}
                                    nested={element.nested}
                                    value={inputs[element.value] || null}
                                    onChange={(e) => handleInputChange(e, i, 'addOrg')}
                                    label={element.label}
                                    InputLabelProps={{
                                       className: classes.label
                                    }}
                                    disabled={element.disabled}
                                 /> :
                                 <Autocomplete
                                    classes={classes}
                                    style={{width: '100%', marginRight: 27}}
                                    id="combo-box-demo"
                                    options={element.option}
                                    defaultValue={props.updated ? element.option.find(v => v.id === inputs[element.name]) : ''}
                                    getOptionLabel={(option) => option[`${element.optionName}`]}
                                    onChange={(e, newValue) => handleInputComplete(e, newValue, element.name)}
                                    // value={inputs[element.value]}
                                    disabled={element.disabled}
                                    type={element.name}
                                    renderInput={(params) => <TextField
                                       {...params} label={element.label} variant="outlined"
                                       InputLabelProps={{className: style.label}}
                                       name={element.name}
                                       size="small"/>}
                                 />
                              }
                           </Grid>
                        )}
                     </Grid>
                     <Grid container spacing={3}>
                        <Grid item xs={4} xl={4}>
                           <p>{t('mfo')}</p>
                           {mfo.map((field, idx) =>
                              <div className={style.add}>
                                 <TextField
                                    key={idx}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                       className: classes.multilineColor
                                    }}
                                    className={classes.inputRoot}
                                    name={'mfo'}
                                    type={'mfo'}
                                    // nested={element.nested}
                                    value={field.mfo}
                                    onChange={(e) => handleInputChange(e, idx, 'mfo')}
                                    InputLabelProps={{
                                       className: classes.label
                                    }}
                                    style={{width: '100%', marginRight: 27}}
                                    // disabled={element.disabled}
                                 />
                                 {idx + 1 !== mfo.length && mfo.length > 1 ?
                                    <Button btnType="remove" clicked={() => handleRemoveMfo(idx)}>-</Button> : ''}
                                 {idx + 1 === mfo.length ?
                                    <Button btnType="add" clicked={() => handleAddMfo()}>+</Button> : ''}
                              </div>
                           )}
                        </Grid>
                        <Grid item xs={4} xl={4}>
                           <p>{t('checkAccount')}</p>
                           {account.map((field, idx) =>
                              <div className={style.add}>
                                 <TextField
                                    key={idx}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                       className: classes.multilineColor
                                    }}
                                    className={classes.inputRoot}
                                    name={'account'}
                                    type={'account'}
                                    value={field.account}
                                    onChange={(e) => handleInputChange(e, idx, 'account')}
                                    InputLabelProps={{
                                       className: classes.label
                                    }}
                                    style={{width: '100%', marginRight: 27}}
                                 />
                                 {idx + 1 !== account.length && account.length > 1 ?
                                    <Button btnType="remove" clicked={() => handleRemoveAccount(idx)}>-</Button> : ''}
                                 {idx + 1 === account.length ?
                                    <Button btnType="add" clicked={() => handleAddAccount()}>+</Button> : ''}
                              </div>
                           )}
                        </Grid>
                     </Grid>
                     <Grid container spacing={3}>
                        <Grid item xs={8} xl={8}>
                           <p>{t('address')}</p>
                           {address.map((field, idx) =>
                              <div className={style.map}>
                                 <div className={style.add}>
                                    <TextField
                                       key={idx}
                                       variant="outlined"
                                       size="small"
                                       InputProps={{
                                          className: classes.multilineColor
                                       }}
                                       className={classes.inputRoot}
                                       name={'name'}
                                       type={'name'}
                                       value={field.name}
                                       onChange={(e) => handleInputChange(e, idx, 'address')}
                                       InputLabelProps={{
                                          className: classes.label
                                       }}
                                       style={{width: '100%', marginRight: 27}}
                                    />
                                    {idx + 1 !== address.length && address.length > 1 ?
                                       <Button btnType="remove"
                                               clicked={() => handleRemoveAddress(idx)}>-</Button> : ''}
                                    {idx + 1 === address.length ?
                                       <Button btnType="add" clicked={() => handleAddAddress()}>+</Button> : ''}
                                 </div>
                                 <YandexMap setData={setData}/>
                              </div>
                           )}
                        </Grid>
                        <Grid item xs={7} xl={7}>
                           <p>{t('contact')}</p>
                           {contact.map((field, idx) =>
                              <div className={style.add}>
                                 <TextField
                                    key={idx}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                       className: classes.multilineColor
                                    }}
                                    className={classes.inputRoot}
                                    name={'email'}
                                    type={'email'}
                                    // nested={element.nested}
                                    value={field.email}
                                    label={'email'}
                                    onChange={(e) => handleInputChange(e, idx, 'contact')}
                                    InputLabelProps={{
                                       className: classes.label
                                    }}
                                    style={{width: '100%', marginRight: 27}}
                                    // disabled={element.disabled}
                                 />
                                 <TextField
                                    key={idx}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                       className: classes.multilineColor
                                    }}
                                    className={classes.inputRoot}
                                    label={'number'}
                                    name={'phoneNumber'}
                                    type={'phoneNumber'}
                                    // nested={element.nested}
                                    value={field.phoneNumber}
                                    onChange={(e) => handleInputChange(e, idx, 'contact')}
                                    InputLabelProps={{
                                       className: classes.label
                                    }}
                                    style={{width: '100%', marginRight: 27}}
                                    // disabled={element.disabled}
                                 />
                                 {idx + 1 !== contact.length && contact.length > 1 ?
                                    <Button btnType="remove" clicked={() => handleRemoveContact(idx)}>-</Button> : ''}
                                 {idx + 1 === contact.length ?
                                    <Button btnType="add" clicked={() => handleAddContact()}>+</Button> : ''}
                              </div>
                           )}
                        </Grid>
                     </Grid>
                     <div className={style.action}>
                        <Button btnType="cancel" clicked={handleClose}>{t('cancel')}</Button>
                        <Button btnType="save" clicked={handleSubmitSingle}>{t('save')}</Button>
                     </div>
                  </div> : <CircularProgress size={30} className={classes.progress}/>}
            </div>
         </TransitionsModal>
      </div>
   )
}