import React, {useContext, useEffect, useState} from 'react';
import style from "./addApplications.module.css";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {makeStyles} from "@material-ui/core/styles";
import axios from "../../../../API/api";
import {Store} from "../../../../Store";
import Button from "../../../UI/Button/Button";
import {useTranslation} from "react-i18next";
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles(theme => ({
   inputRoot: {
      color: '#fff',
      width: '100%',
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
   label: {
      fontSize: 12
   }
}));

export default function Add() {
   const classes = useStyles();
   const {t} = useTranslation();
   let history = useHistory();
   const {state, dispatch} = useContext(Store);
   const [organizations, setOrganizations] = useState([]);
   const [organizatonTrue, setOrganizationTrue] = useState([]);
   const [products, setProducts] = useState([]);
   const [typeCode, setTypeCode] = useState([]);
   const [objects, setObjects] = useState([]);
   const [inputs, setInputs] = useState( {});
   const [contact, setContact] = useState([{
      count: '',
      productId: '',
      productModelName: '',
      productTypeName: '',
      unitTypeId: ''
   }]);
   const dateObj = new Date();
   const month = dateObj.getUTCMonth() + 1; //months from 1-12
   const day = dateObj.getUTCDate();
   const year = dateObj.getUTCFullYear();

   const newdate = day + "." + month + "." + year;

   useEffect(() => {
      Promise.all([
         axios.get(`/api/v1/organizations?myOrganizations=true`, {headers: {Authorization: `Bearer ${state.token}`}}),
         axios.get(`/api/v1/organizations`, {headers: {Authorization: `Bearer ${state.token}`}}),
         axios.get(`/api/v1/products`, {headers: {Authorization: `Bearer ${state.token}`}}),
         axios.get(`/api/v1/types?typeCode=UNIT_TYPE`, {headers: {Authorization: `Bearer ${state.token}`}}),
         axios.get(`/api/v1/objects`, {headers: {Authorization: `Bearer ${state.token}`}})
      ]).then(function (res) {
         const organizationsTrue = res[0];
         const organizations = res[1];
         const products = res[2];
         const typeCode = res[3];
         const objects = res[4];
         setProducts(products.data.data)
         setOrganizations(organizations.data.data)
         setOrganizationTrue(organizationsTrue.data.data)
         setTypeCode(typeCode.data.data)
         setObjects(objects.data.data)
      }).catch((err) => {
         console.log(err)
         if (err.response ? err.response.status === 401 : '') {
            localStorage.removeItem('id_token');
            return dispatch({type: 'SET_TOKEN', payload: ''})
         }
      })
   }, [])

   const Add = [
      {
         label: 'Покупатель',
         name: 'builderOrganizationId',
         value: 'builderOrganizationId',
         textArea: false,
         option: organizatonTrue,
         optionName: 'builderOrganizationName',
         disabled: true
      },
      {
         label: 'Плательщик',
         name: 'payerOrganizationId',
         value: 'payerOrganizationId',
         textArea: false,
         option: organizations,
         optionName: 'payerOrganizationName',
         disabled: true
      },
      {
         label: 'Дата заявки',
         name: 'date',
         value: newdate,
         textArea: true,
         optionName: '',
      },
      {
         label: 'Оббъекты',
         name: 'objectId',
         textArea: false,
         optionName: 'objectName',
         option: objects,
         disabled: inputs.forObject
      },
   ]
   const clasue = [
      {
         label: 'Наименование продукции',
         name: 'productId',
         value: 'productId',
         textArea: false,
         option: products,
         optionName: 'builderOrganizationName'
      },
      {
         label: 'Модель',
         name: 'productModelName',
         value: 'productModelName',
         textArea: true,
         option: organizations,
         optionName: 'builderOrganizationName',
         type: 'text'
      },
      {
         label: 'Тип ',
         name: 'productTypeName',
         value: 'productTypeName',
         textArea: true,
         option: organizations,
         optionName: 'builderOrganizationName',
         type: 'text'
      },
      {
         label: 'Количество',
         name: 'count',
         value: 'count',
         textArea: true,
         option: organizations,
         optionName: 'builderOrganizationName',
         type: 'number'
      },
      {
         label: 'Единица измерения',
         name: 'unitTypeId',
         value: 'unitTypeId',
         textArea: false,
         option: typeCode,
         optionName: 'builderOrganizationName'
      },
   ]

   function handleAddContact() {
      setContact([...contact, {count: '', productId: '', productModelName: '', productTypeName: '', unitTypeId: ''}]);
   }

   function handleRemoveContact(i) {
      const list = [...contact];
      list.splice(i, 1);
      setContact(list);
   }

   const handleInputChange = (event, i, state) => {
      const {name, value} = event.target;
      if (state === 'contact') {
         const list = [...contact];
         list[i][name] = value;
         setContact(list);
      } else {
         setInputs(inputs => ({...inputs, [name]: event.target.value}));
      }
   }
   const handleInputComplete = (event, newValue, name, i, state) => {
      event.persist();
      if (state === 'contact') {
         const list = [...contact];
         list[i][name] = newValue ? newValue.id : '';
         setContact(list);
      } else if (name === 'builderOrganizationId') {
         setInputs(inputs => ({...inputs, [`forObject`]: newValue ? newValue.forObjectName : ''}));
         setInputs(inputs => ({...inputs, [`builderOrganizationId`]: newValue ? newValue.id : ''}));
      } else {
         setInputs(inputs => ({...inputs, [`${name}`]: newValue ? newValue.id : ''}));
      }
   }
   const handleSubmitSingle = (e) => {
      e.preventDefault();
      let create = {
         "applicationItems": contact.filter(v => v.count && v.productId && v.unitTypeId !== ""),
         "builderOrganizationId": inputs.builderOrganizationId,
         "objectId": inputs.objectId,
         "payerOrganizationId": inputs.payerOrganizationId
      }
      axios.post(`/api/v1/application/create`, create, {headers: {Authorization: `Bearer ${state.token}`}})
         .then(response => {
            console.log(response)
            if (response.status === 201 || 200) {
               history.push('/application/receive')
               return dispatch({type: 'UPDATED', payload: Math.random()})
            }
         })
         .catch(function (error) {
            console.log(error.response)
         })
   }

   return (
      <div className={style.main}>
         <div className={style.top} onSubmit={handleSubmitSingle}>
            <p>Добавить заявку</p>
            <Grid container spacing={3}>
               {Add.map((element, i) =>
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
                           value={inputs[element.value]}
                           onChange={(e) => handleInputChange(e)}
                           label={element.label}
                           InputLabelProps={{
                              className: classes.label
                           }}
                        /> :
                        <Autocomplete
                           classes={classes}
                           style={{width: '100%', marginRight: 27}}
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
                        />
                     }
                  </Grid>
               )}
            </Grid>
            <p>Пункт о заявке</p>
            {contact.map((field, idx) =>
               <Grid container>
                  {clasue.map((element, i) =>
                     <Grid item
                           xs={element.name === 'productId' ? 3 : 2}
                           xl={element.name === 'productId' ? 3 : 2}>
                        <div className={style.add}>
                           {element.textArea === true ?
                              <TextField
                                 key={idx}
                                 variant="outlined"
                                 size="small"
                                 InputProps={{
                                    className: classes.multilineColor
                                 }}
                                 className={classes.inputRoot}
                                 name={element.name}
                                 type={element.type}
                                 value={field[element.value]}
                                 label={element.label}
                                 onChange={(e) => handleInputChange(e, idx, 'contact')}
                                 InputLabelProps={{
                                    className: classes.label
                                 }}
                                 style={{width: '100%', marginRight: 15}}
                              /> :
                              <Autocomplete
                                 classes={classes}
                                 style={{width: '100%', marginRight: 27}}
                                 id="combo-box-demo"
                                 options={element.option}
                                 defaultValue={element.option.find(v => v.id === field[element.name])}
                                 getOptionLabel={(option) => option.name}
                                 onChange={(e, newValue) =>
                                    handleInputComplete(e, newValue, element.name, idx, 'contact')}
                                 renderInput={(params) => <TextField
                                    {...params} label={element.label} variant="outlined"
                                    InputLabelProps={{className: classes.label}}
                                    name={element.name}
                                    size="small"/>}
                              />
                           }
                        </div>
                     </Grid>
                  )}
                  <div className={style.plus}>
                     {idx + 1 !== contact.length && contact.length > 1 ?
                        <Button btnType="remove" clicked={() => handleRemoveContact(idx)}>-</Button> : ''}
                     {idx + 1 === contact.length ?
                        <Button btnType="add" clicked={() => handleAddContact()}>+</Button> : ''}
                  </div>
               </Grid>
            )}
         </div>
         <div className={style.action}>
            <Button btnType="save" clicked={handleSubmitSingle}>{t('save')}</Button>
         </div>
      </div>
   )
}
