import React, {useContext, useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {Store} from "../../../../Store";
import TransitionsModal from "../../../UI/Modal/Modal";
import Button from "../../../UI/Button/Button";
import style from "../../Users/users.module.css";
import axios from "../../../../API/api";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

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
   },
   progress: {
      Width: 10,
      margin: "auto"
   },
}));

export default function UpdatedApplication(props) {
   const classes = useStyles();
   const {t} = useTranslation();
   const [open, setOpen] = useState(false);
   const {state, dispatch} = useContext(Store);
   const [inputs, setInputs] = useState({});
   const [contact, setContact] = useState([{
      count: '',
      productId: '',
      productModelName: '',
      productTypeName: '',
      unitTypeId: ''
   }])
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      if (open === true) {
         Promise.all([
            axios.get(`/api/v1/application/${props.id}`, {headers: {Authorization: `Bearer ${state.token}`}})
         ]).then(function (res) {
            const updated = res[0];
            setInputs(updated.data.data)
            if (updated.data.data.applicationItems.length !== 0) {
               setContact(updated.data.data.applicationItems)
            }
            setIsLoading(true)
         }).catch((err) => {
            console.log(err)
            if (err.response ? err.response.status === 401 : '') {
               localStorage.removeItem('id_token');
               return dispatch({type: 'SET_TOKEN', payload: ''})
            }
         })
      }
   }, [props.id, open])

   const handleOpen = () => {
      setOpen(true);
   }

   const handleClose = () => {
      setOpen(false);
   };

   function handleAddContact() {
      setContact([...contact, {count: '', productId: '', productModelName: '', productTypeName: '', unitTypeId: ''}]);
   }

   function handleRemoveContact(i) {
      const list = [...contact];
      list.splice(i, 1);
      setContact(list);
   }

   const handleSubmitSingle = (e) => {
      e.preventDefault();
      let update = {
         "applicationItems": contact.filter(v => v.count && v.productId && v.unitTypeId !== ""),
         "builderOrganizationId": inputs.builderOrganizationId,
         "objectId": inputs.objectId,
         "payerOrganizationId": inputs.payerOrganizationId,
         "id": inputs.id
      }

      axios.put(`/api/v1/application/update`, update, {headers: {Authorization: `Bearer ${state.token}`}})
         .then(response => {
            console.log(response)
            if (response.status === 201 || 200) {
               handleClose();
               return dispatch({type: 'UPDATED', payload: Math.random()})
            }
         })
         .catch(function (error) {
            console.log(error.response)
         })
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

   const Add = [
      {
         label: 'Покупатель',
         name: 'builderOrganizationId',
         value: 'builderOrganizationId',
         textArea: false,
         option: props.orgTrue,
         optionName: 'builderOrganizationName',
         disabled: true
      },
      {
         label: 'Плательщик',
         name: 'payerOrganizationId',
         value: 'payerOrganizationId',
         textArea: false,
         option: props.org,
         optionName: 'payerOrganizationName',
         disabled: true
      },
      {
         label: 'Дата заявки',
         name: 'date',
         value: 'applicationDate',
         textArea: true,
         optionName: '',
      },
      {
         label: 'Оббъекты',
         name: 'objectId',
         textArea: false,
         optionName: 'objectName',
         option: props.obj,
         disabled: inputs.forObject
      },
   ]
   const clasue = [
      {
         label: 'Наименование продукции',
         name: 'productId',
         value: 'productId',
         textArea: false,
         option: props.pro,
         optionName: 'builderOrganizationName'
      },
      {
         label: 'Модель',
         name: 'productModelName',
         value: 'productModelName',
         textArea: true,
         optionName: 'builderOrganizationName',
         type: 'text'
      },
      {
         label: 'Тип ',
         name: 'productTypeName',
         value: 'productTypeName',
         textArea: true,
         optionName: 'builderOrganizationName',
         type: 'text'
      },
      {
         label: 'Количество',
         name: 'count',
         value: 'count',
         textArea: true,
         optionName: 'builderOrganizationName',
         type: 'number'
      },
      {
         label: 'Единица измерения',
         name: 'unitTypeId',
         value: 'unitTypeId',
         textArea: false,
         option: props.typeCode,
         optionName: 'builderOrganizationName'
      },
   ]

   return (
      <div>
         {props.img ? <img src={props.img} alt="" onClick={handleOpen}/> :
            <Button btnType="addUser" clicked={handleOpen}>{t('add')}</Button>}
         <TransitionsModal open={open} handleClose={handleClose}>
            <div className={style.modal} onSubmit={handleSubmitSingle}>
               {isLoading === true ?
                  <div>
                     <p>Изменить заявку</p>
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
                                    style={element.disabled === true ? {
                                       display: 'flex',
                                       width: '100%',
                                       marginRight: 27
                                    } : {display: 'none', width: '100%', marginRight: 27}}
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