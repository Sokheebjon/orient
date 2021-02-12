import React, {useContext, useRef, useState} from 'react';
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import axios from '../../API/api';
import {Store} from "../../Store";
import {useTranslation} from "react-i18next";
import Button from "../UI/Button/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Autocomplete from "@material-ui/lab/Autocomplete";
import style from "../Tables/Users/users.module.css";
import Grid from "@material-ui/core/Grid";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
   inputRoot: {
      fontSize: 12,
      maxWidth: 300,
      minHeight: 40,
      width: '100%',
      color: '#fff',
      background: 'none',
      fontFamily: "Montserrat",
      "& .MuiOutlinedInput-notchedOutline": {
         borderWidth: "1px",
         borderColor: "rgba(255, 255, 255, 1)",
         color: '#fff'
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
         borderWidth: "1px",
         borderColor: "#4B74FF",
         color: '#fff'
      },
      '& label.Mui-focused': {
         color: 'white',
      },
      "&:focus .MuiOutlinedInput-notchedOutline": {
         borderWidth: "1px",
         borderColor: "#4B74FF",
         color: '#fff'
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
   submit: {
      margin: theme.spacing(5, 0, 2, 1),
      border: 'none',
      padding: 8,
      width: 250,
      background: '#7075FF',
      fontSize: 12
   },
   progress: {
      Width: 10,
      margin: theme.spacing(5, 0, 2, 15),
   },
   form: {
      marginTop: 25
   },
   multilineColor: {
      color: '#fff',
      borderColor: '#fff'
   }
}));

export default function Form(props) {
   const {dispatch, state} = useContext(Store);
   const [inputs, setInputs] = useState(props.updateInfo ? props.updateInfo : {});

   const {t} = useTranslation();
   const classes = useStyles();
   const [states, setStates] = useState(false);
   const [errorAuth, setErrorAuth] = useState(false);
   const [fields, setFields] = useState([{value: null}]);
   const uploadedImage = useRef(null);
   const imageUploader = useRef(null);

   const handleInputChange = (event) => {
      event.persist();
      const name = event.target.name;
      if (props.nested) {
         if (name === 'code' || 'name') {
            setInputs(inputs => ({
               ...inputs,
               [event.target.name]: event.target.value
            }))
         } else {
            setInputs(inputs => ({
               ...inputs,
               [props.nested]: {
                  ...inputs[props.nested],
                  [event.target.name]: event.target.value
               }
            }))
         }
      } else {
         setInputs(inputs => ({...inputs, [name]: event.target.value}));
      }
   }
   const handleInputComplete = (event, name) => {
      event.persist();
      console.log(name)
      setInputs(inputs => ({...inputs, [name]: event.target.innerText}));
   }

   const handleSubmitAuth = (e) => {
      e.preventDefault();
      setStates(true);
      axios.post(props.url, {"userName": inputs.login, "password": inputs.password})
         .then(response => {
            localStorage.setItem('id_token', response.data.data.sessionToken)
            return dispatch({type: 'SET_TOKEN', payload: localStorage.getItem('id_token')})
         })
         .catch(error => {
            setErrorAuth(true)
            setStates(false)
            toast.configure();
            toast.error((error.response.data.error.friendlyMessage), {
               position: "top-right",
               autoClose: 3000,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
            });
         })
   }

   const handleSubmitSingle = (e) => {
      e.preventDefault();
      console.log(e)
      let data = {
         "code": inputs.code,
         "id": inputs.id,
         "translations": {
            "name": inputs.name,
            "nameEn": inputs.nameEn,
            "nameRu": inputs.nameRu,
            "nameUz": inputs.nameUz
         }
      }
      const body = props.nested ? data : inputs
      axios[props.updateInfo ? 'put' : 'post'](props.updateInfo ? props.updateURL : props.url, body, {headers: {Authorization: `Bearer ${state.token}`}})
         .then(response => {
            console.log(response)
            if (response.status === 201 || 200) {
               props.handleClose()
               return dispatch({type: 'UPDATED', payload: Math.random()})
            }
         })
         .catch(function (error) {
            toast.configure();
            toast.error((error.response.data.error.friendlyMessage), {
               position: "top-right",
               autoClose: 3000,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
            });
         })
   }

   function handleAdd() {
      const values = [...fields];
      values.push({value: null});
      setFields(values);
   }

   function handleRemove(i) {
      const values = [...fields];
      values.splice(i, 1);
      setFields(values);
   }

   const handleImageUpload = e => {
      const [file] = e.target.files;
      if (file) {
         const reader = new FileReader();
         const {current} = uploadedImage;
         current.file = file;
         reader.onload = e => {
            current.src = e.target.result;
         };
         reader.readAsDataURL(file);
      }
   }

   return (
      <div>
         {props.type === 'auth' ?
            <form className={classes.form} onSubmit={handleSubmitAuth}>
               {props.inputForm.map((element, i) =>
                  <TextField
                     key={i}
                     error={errorAuth}
                     className={classes.inputRoot}
                     InputProps={{
                        className: classes.input,
                        form: {
                           autoComplete: 'off',
                        },
                     }}
                     InputLabelProps={{
                        className: classes.label
                     }}
                     variant="outlined"
                     margin="normal"
                     required={element.required}
                     label={element.label}
                     name={element.name}
                     size="small"
                     autoComplete='off'
                     value={inputs[element.value] || null}
                     onChange={handleInputChange}
                     type={element.name}
                  />
               )}
               {states === false ?
                  <Button
                     type="submit"
                     fullWidth
                     variant="contained"
                     color="primary"
                     btnType="submit"
                     className={classes.submit}
                  >
                     {t('signIn')}
                  </Button> :
                  <CircularProgress size={30} className={classes.progress}/>}
            </form>
            :
            //--------------------------- ADD USER ----------------------------
            (props.type === 'add' ?
                  <Grid container spacing={3}>
                     {props.inputForm.map((element, i) =>
                        <Grid item xs={3} xl={3}>
                           <Autocomplete
                              key={i}
                              autoComplete={false}
                              className={[classes.inputRoot, style.autoComplete].join(' ')}
                              id="combo-box-demo"
                              options={top100Films}
                              getOptionLabel={(option) => option.title}
                              renderInput={(params) => <TextField
                                 {...params} label={element.label} variant={element.variant}
                                 value={inputs[element.value] || null}
                                 onChange={handleInputChange}
                                 InputLabelProps={{className: classes.label}}
                                 style={{marginBottom: 10}}
                                 size="small"/>}
                           />
                        </Grid>
                     )}
                     <Grid item xs={7} xl={7}>
                        <p>{t('contact')}</p>
                        {fields.map((field, idx) =>
                           <div className={style.add}>
                              <Autocomplete
                                 classes={classes}
                                 style={{width: '100%', marginRight: 27}}
                                 id="combo-box-demo"
                                 options={top100Films}
                                 getOptionLabel={(option) => option.title}
                                 renderInput={(params) => <TextField
                                    {...params} label={t('emailAdd')} variant="outlined"
                                    InputLabelProps={{className: style.label}}
                                    size="small"/>}
                              />
                              <Autocomplete
                                 classes={classes}
                                 style={{width: '100%', marginRight: 27}}
                                 id="combo-box-demo"
                                 options={top100Films}
                                 getOptionLabel={(option) => option.title}
                                 renderInput={(params) => <TextField
                                    {...params} label={t('telNum')} variant="outlined"
                                    InputLabelProps={{className: style.label}}
                                    size="small"/>}
                                 variant="outlined"
                              />
                              {idx + 1 !== fields.length && fields.length > 1 ?
                                 <Button btnType="remove" clicked={() => handleRemove(idx)}>-</Button> : ''}
                              {idx + 1 === fields.length ?
                                 <Button btnType="add" clicked={() => handleAdd()}>+</Button> : ''}
                           </div>
                        )}
                        <div className={style.action}>
                           <Button btnType="cancel" clicked={props.handleClose}>{t('cancel')}</Button>
                           <Button btnType="save">{t('save')}</Button>
                        </div>
                     </Grid>
                  </Grid> :
                  (props.type === 'single' ?
                     <div onSubmit={handleSubmitSingle}>
                        <Grid container spacing={3}>
                           {props.inputForm.map((element, i) =>
                              <Grid item xs={props.xs} xl={props.xl} className={style.colorAutocomplete}>
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
                                       onChange={props.editRule === true && element.name === 'value' ? '' : handleInputChange}
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
                                       options={element.option ? element.option : top100Films}
                                       getOptionLabel={(option) => option[`${element.optionName}`] ? option[`${element.optionName}`] : option.title}
                                       onChange={(e) => handleInputComplete(e, element.name)}
                                       value={inputs[element.value]}
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
                        {props.sender === true ?
                           <div className={style.action1}>
                              <Button btnType="cancel" clicked={props.handleClose}>Отмена</Button>
                              <Button btnType="save" clicked={handleSubmitSingle}>Сохранить</Button>
                           </div>
                           : ''}
                     </div> : '')
            )
         }
      </div>
   )
}

const top100Films = [
   {title: 'The Shawshank Redemption', year: 1994},
   {title: 'The Godfather', year: 1972},
   {title: 'The Godfather: Part II', year: 1974},
   {title: 'The Dark Knight', year: 2008},
   {title: '12 Angry Men', year: 1957},
];