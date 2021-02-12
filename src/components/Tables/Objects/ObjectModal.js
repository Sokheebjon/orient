import React, {useContext, useEffect, useState} from 'react';
import TransitionsModal from "../../UI/Modal/Modal";
import style from "../Users/users.module.css";
import Button from "../../UI/Button/Button";
import {useTranslation} from "react-i18next";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {makeStyles} from "@material-ui/core/styles";
import YandexMap from "../Map/Map";
import axios from "../../../API/api";
import {Store} from "../../../Store";

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

export default function ObjectModal(props) {
   const classes = useStyles();
   const {t} = useTranslation();
   const {state, dispatch} = useContext(Store);
   const [open, setOpen] = useState(false);
   const [types, setTypes] = useState(props.updated === true && props.data.objectTypeProperties ?
      (props.data.objectTypeProperties.length !== 0 ? props.data.objectTypeProperties : [{name: ''}]) : [{name: ''}]);
   const [inputs, setInputs] = useState(props.updated === true ? props.data : {});
   const [data, setData] = useState('');
   const [objpropperties, setObjProperties] = useState([]);
   const [objValue, setObjValue] = useState([]);

   useEffect(() => {
      if (inputs.objectTypeId) {
         axios.get(`/api/v1/object/type/${inputs.objectTypeId}`, {headers: {Authorization: `Bearer ${state.token}`}})
            .then((res) => {
               setObjProperties(res.data.data.objectTypeProperties)
            })
            .catch((err) => {
               console.log(err)
               if (err.response ? err.response.status === 401 : '') {
                  localStorage.removeItem('id_token');
                  return dispatch({type: 'SET_TOKEN', payload: ''})
               }
            })
      }
      if (props.id) {
         axios.get(`/api/v1/object/31`, {headers: {Authorization: `Bearer ${state.token}`}})
            .then((res) => {
               setObjValue(res.data.data.objectProperties)
            })
            .catch((err) => {
               console.log(err)
               if (err.response ? err.response.status === 401 : '') {
                  localStorage.removeItem('id_token');
                  return dispatch({type: 'SET_TOKEN', payload: ''})
               }
            })
      }
   }, [inputs.objectTypeId, props.id])

   const handleOpen = () => {
      setOpen(true);
   }

   const handleClose = () => {
      setOpen(false);
   };

   function handleAddMfo() {
      setTypes([...types, {name: ''}]);
   }

   function handleRemoveMfo(i) {
      const list = [...types];
      list.splice(i, 1);
      setTypes(list);
   }

   const handleInputChange = (event, i, state) => {
      const {name, value} = event.target;
      if (state === 'dolgota') {
         const list = [...objpropperties];
         list[i]['value'] = value;
         setObjProperties(list);
      } else if (state === 'name') {
         const list = [...types];
         list[i][name] = value;
         setTypes(list);
      } else {
         setInputs(inputs => ({...inputs, [name]: event.target.value}));
      }
   }
   const handleInputComplete = (event, newValue, name) => {
      event.persist();
      setInputs(inputs => ({...inputs, [`${name}`]: newValue ? newValue.id : ''}));
   }
   const handleSubmitSingle = (e) => {
      e.preventDefault();
      let createObject = {
         "address": inputs.address,
         "builderOrganizationId": inputs.builderOrganizationId,
         "latitude": 39,
         "longitude": 61,
         "name": inputs.name,
         "objectProperties": objpropperties,
         "objectTypeId": inputs.objectTypeId,
         "payerOrganizationId": inputs.payerOrganizationId
      }
      let update = {
         "id": props.data ? props.data.id : '',
         "address": inputs.address,
         "builderOrganizationId": inputs.builderOrganizationId,
         "latitude": 39,
         "longitude": 61,
         "name": inputs.name,
         "objectProperties": objpropperties,
         "objectTypeId": inputs.objectTypeId,
         "payerOrganizationId": inputs.payerOrganizationId
      }
      let typeCreate = {
         "name": inputs.name,
         "objectTypeProperties": types.filter(value => value.name !== "")
      }
      let typeUpdate = {
         "id": props.data ? props.data.id : '',
         "name": inputs.name,
         "objectTypeProperties": types.filter(value => value.name !== "")
      }
      axios[props.updated === true ? 'put' : 'post'](props.updated === true ? props.updatedUrl : props.postUrl,
         props.updated === true ? (props.objectType === true ? typeUpdate : update)
            : (props.objectType === true ? typeCreate : createObject), {headers: {Authorization: `Bearer ${state.token}`}})
         .then(response => {
            console.log(response)
            if (response.status === 201 || 200) {
               handleClose()
               setTypes([{name: ''}])
               setInputs({})
               setObjProperties([])
               return dispatch({type: 'UPDATED', payload: Math.random()})
            }
         })
         .catch(function (error) {
            console.log(error.response)
         })
   }
   // console.log(objValue)
   return (
      <div>
         {props.img ? <img src={props.img} alt="" onClick={handleOpen}/> :
            <Button btnType="addUser" clicked={handleOpen}>{t('add')}</Button>}
         <TransitionsModal open={open} handleClose={handleClose}>
            <div className={style.modal} onSubmit={handleSubmitSingle}>
               <p>{props.title}</p>
               <Grid container spacing={3}>
                  {props.inputForm ? props.inputForm.map((element, i) =>
                     <Grid item xs={3} xl={3} key={i}>
                        {element.textArea === true ?
                           <TextField
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
                              defaultValue={props.updated ? element.option.find(v => v.name === inputs[`${element.optionName}`]) : ''}
                              getOptionLabel={(option) => option.name}
                              onChange={(e, newValue) =>
                                 handleInputComplete(e, newValue, element.name)}
                              renderInput={(params) => <TextField
                                 {...params} label={element.label} variant="outlined"
                                 InputLabelProps={{className: style.label}}
                                 name={element.name}
                                 size="small"/>}
                           />
                        }
                     </Grid>
                  ) : ''}
                  {props.inputForm && props.map === true ?
                     <Grid item xs={10} xl={10}>
                        <p>{t('address')}</p>
                        <div className={style.map}>
                           <div className={style.add}>
                              <TextField
                                 variant="outlined"
                                 size="small"
                                 InputProps={{
                                    className: classes.multilineColor
                                 }}
                                 className={classes.inputRoot}
                                 name={'address'}
                                 type={'address'}
                                 value={inputs.address}
                                 onChange={handleInputChange}
                                 InputLabelProps={{
                                    className: classes.label
                                 }}
                                 style={{width: '100%', marginRight: 27}}
                              />
                           </div>
                           <YandexMap setData={setData}/>
                        </div>
                     </Grid> : ''}
                  {objpropperties ? objpropperties.map((element, i) =>
                     <Grid item xs={3} xl={3} key={i}>
                        <TextField
                           variant="outlined"
                           size="small"
                           InputProps={{
                              className: classes.multilineColor
                           }}
                           className={classes.inputRoot}
                           name={'name'}
                           value={props.updated === true && objValue.length !== 0 ? objValue[i].value : objpropperties[i].value}
                           onChange={(e) => handleInputChange(e, i, 'dolgota')}
                           label={element.name}
                           InputLabelProps={{
                              className: classes.label
                           }}
                        />
                     </Grid>
                  ) : ''}
                  {props.objectType === true ?
                     <Grid item xs={4} xl={4}>
                        {types.map((field, idx) =>
                           <div className={style.add}>
                              <TextField
                                 key={idx}
                                 variant="outlined"
                                 size="small"
                                 label={'Объект типов'}
                                 InputProps={{
                                    className: classes.multilineColor
                                 }}
                                 className={classes.inputRoot}
                                 name={'name'}
                                 value={field.name}
                                 onChange={(e) => handleInputChange(e, idx, 'name')}
                                 InputLabelProps={{
                                    className: classes.label
                                 }}
                                 style={{width: '100%', marginRight: 27}}
                              />
                              {idx + 1 !== types.length && types.length > 1 ?
                                 <Button btnType="remove" clicked={() => handleRemoveMfo(idx)}>-</Button> : ''}
                              {idx + 1 === types.length ?
                                 <Button btnType="add" clicked={() => handleAddMfo()}>+</Button> : ''}
                           </div>
                        )}
                     </Grid>
                     : ''}
                  {props.eye ? props.eyeData.map((element, i) =>
                        <Grid item xs={3} xl={3} key={i}>
                           <p>* {element.name}</p>
                        </Grid>
                     )
                     : ''}
               </Grid>
               {props.eye === true ? '' :
                  <div className={style.action}>
                     <Button btnType="cancel" clicked={handleClose}>{t('cancel')}</Button>
                     <Button btnType="save" clicked={handleSubmitSingle}>{t('save')}</Button>
                  </div>
               }
            </div>
         </TransitionsModal>
      </div>
   )
}