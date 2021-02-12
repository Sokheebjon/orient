import React, {useContext, useEffect, useRef, useState} from 'react';
import style from './users.module.css';
import Button from "../../UI/Button/Button";
import TransitionsModal from "../../UI/Modal/Modal";
import {useTranslation} from "react-i18next";
import axios from "../../../API/api";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {makeStyles} from "@material-ui/core/styles";
import user from "../../../assets/pages/user.svg";
import camera from "../../../assets/pages/camera.svg";
import {Store} from "../../../Store";

const useStyles = makeStyles((theme) => ({
   inputRoot: {
      fontSize: 12,
      maxWidth: 300,
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
   multilineColor: {
      color: '#fff',
      borderColor: '#fff'
   }
}));

export default function AddUser(props) {
   const [open, setOpen] = useState(false);
   const {state, dispatch} = useContext(Store);
   const [inputs, setInputs] = useState(props.updateInfo ? props.updateInfo : {});
   const {t} = useTranslation();
   const classes = useStyles();
   const uploadedImage = useRef(null);
   const imageUploader = useRef(null);
   const [positionType, setPositionType] = useState([]);
   const [supplyDepartmentType, setSupplyDepartmentType] = useState([]);
   const [role, setRole] = useState([]);
   const [orgData, setOrgData] = useState([]);
   const [organizationData, setOrganizationData] = useState([]);
   const [roleData, setRoleData] = useState([]);
   const [loader, setLoader] = useState(false);
   const [contact, setContact] = useState([{
      email: '',
      phoneNumber: ''
   }]);


   useEffect(() => {
      if (open === true) {
         if (props.updated === true && props.id) {
            axios.get(`/api/v1/user/${props.id}`, {headers: {Authorization: `Bearer ${state.token}`}})
               .then(res => {
                  setInputs(res.data.data);
                  setContact(res.data.data.contacts);
                  setOrganizationData(res.data.data.organizations);
                  imageRender(`192.168.0.200:8082${res.data.data.photoUrl}`)
                  setLoader(true);
               })
               .catch(err => {
                  console.log(err)
                  if (err.response ? err.response.status === 401 : '') {
                     localStorage.removeItem('id_token');
                     return dispatch({type: 'SET_TOKEN', payload: ''})
                  }
               })
         }
         Promise.all([
            axios.get(`/api/v1/types?typeCode=USER_POSITION_TYPE`, {headers: {Authorization: `Bearer ${state.token}`}}),
            axios.get(`/api/v1/types?typeCode=SUPPLY_USER_POSITION_TYPE`, {headers: {Authorization: `Bearer ${state.token}`}}),
            axios.get(`/api/v1/organizations?myOrganizations=true`, {headers: {Authorization: `Bearer ${state.token}`}}),
            axios.get(`/api/v1/roles`, {headers: {Authorization: `Bearer ${state.token}`}}),
         ]).then(function (results) {
            const type1 = results[0];
            const type2 = results[1];
            const org = results[2];
            const role = results[3];
            setPositionType(type1.data.data);
            setSupplyDepartmentType(type2.data.data);
            setOrgData(org.data.data);
            setRole(role.data.data);
            setLoader(true);
         }).catch((err) => {
            console.log(err)
            if (err.response ? err.response.status === 401 : '') {
               localStorage.removeItem('id_token');
               return dispatch({type: 'SET_TOKEN', payload: ''})
            }
         })
      }
   }, [state.updated, open, props.id])

   const handleSubmitData = (e) => {
      e.preventDefault();
      let data = {
         "firstName": inputs.firstName,
         "lastName": inputs.lastName,
         "middleName": inputs.middleName,
         "username": inputs.username,
         "password": inputs.password,
         "ordering": inputs.ordering,
         "supplyDepartmentTypeId": inputs.supplyDepartmentTypeId,
         "positionTypeId": inputs.positionTypeId,
         "contacts": contact,
         "organizations": organizationData,
         "roles": roleData,
         "gender": true,
         "birthDate": dateFormat(inputs.birthDate),
         "resourceFileId": inputs.resourceFileId,
      }
      let update = {
         "firstName": inputs.firstName,
         "lastName": inputs.lastName,
         "middleName": inputs.middleName,
         "username": inputs.username,
         "password": inputs.password,
         "ordering": inputs.ordering,
         "supplyDepartmentTypeId": inputs.supplyDepartmentTypeId,
         "positionTypeId": inputs.positionTypeId,
         "userContacts": contact,
         "organizations": organizationData,
         "roles": roleData,
         "gender": true,
         "birthDate": dateFormat(inputs.birthDate),
         "resourceFileId": inputs.resourceFileId,
         "id": props.updated === true ? props.id : ''
      }
      axios[props.updated === true ? 'put' : 'post'](props.updated === true ? props.updatedUrl : `/api/v1/user/create`,
         props.updated === true ? update : data, {headers: {Authorization: `Bearer ${state.token}`}})
         .then(response => {
            if (response.status === 201 || 200) {
               handleClose();
               return dispatch({type: 'UPDATED', payload: Math.random()})
            }
         })
         .catch(function (error) {
            console.log(error.response)
         })
   }

   const dateFormat = (date) => {
      const d = new Date(date);
      return ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
         d.getFullYear();
   };

   const handleOpen = () => {
      setOpen(true);
   }

   const handleClose = () => {
      setOpen(false);
   };

   function handleAddContact() {
      setContact([...contact, {email: '', phoneNumber: ''}]);
   }

   function handleRemoveContact(i) {
      const list = [...contact];
      list.splice(i, 1);
      setContact(list);
   }

   const handleInputChange = (event, i, state) => {
      event.persist();
      const {name, value} = event.target;
      if (state === 'contact') {
         const list = [...contact];
         list[i][name] = value;
         setContact(list);
      } else {
         setInputs(inputs => ({...inputs, [name]: event.target.value}));
      }
   }
   const imageRender = (file) => {
      const reader = new FileReader();
      const {current} = uploadedImage;
      current.file = file;
      reader.onload = e => {
         current.src = e.target.result;
      };
      reader.readAsDataURL(file);
   }

   const handleInputComplete = (event, newValue, name) => {
      event.persist();
      setInputs(inputs => ({...inputs, [name]: newValue.id}));
      if (name === 'org' && newValue) {
         setOrganizationData(organizationData => ([]));
         newValue.map((value) => setOrganizationData(organizationData => ([...organizationData, {['id']: value.id ? value.id : ''}])))
      } else if (name === 'role' && newValue) {
         setRoleData(roleData => ([]));
         newValue.map((value) => setRoleData(roleData => ([...roleData, {['id']: value.id ? value.id : ''}])))
      }
   }
   const handleImageUpload = e => {
      const [file] = e.target.files;
      if (file) {
         const formData = new FormData();
         formData.append("file", file);
         formData.append("upload_file", true);

         axios['post']('/api/v1/resource/upload/file', formData, {headers: {Authorization: `Bearer ${state.token}`}})
            .then((res) => {
               setInputs(inputs => ({...inputs, ['resourceFileId']: res.data.data.id}));

               imageRender(file)
            })
            .catch(function (error) {
               console.log(error.response)
            })
      }
   }
   console.log(inputs.photoUrl)
   const inputForm = [
      {
         label: t('org'),
         variant: 'outlined',
         name: 'org',
         value: 'org',
         required: true,
         textarea: false,
         option: orgData,
         multiple: true,
         optionName: "name",
      },
      {
         label: t('positionType'),
         variant: 'outlined',
         name: 'positionTypeId',
         value: 'positionTypeId',
         required: true,
         textarea: false,
         option: positionType,
         optionName: "name"
      },
      {
         label: t('supplyDepartmentType'),
         variant: 'outlined',
         name: 'supplyDepartmentTypeId',
         value: 'supplyDepartmentType',
         required: true,
         textarea: false,
         option: supplyDepartmentType,
         optionName: "name"
      },
      {
         label: t('role'),
         variant: 'outlined',
         name: 'role',
         value: 'role',
         required: true,
         textarea: false,
         option: role,
         multiple: true,
         optionName: "name"
      },
      {
         label: t('lastName'),
         variant: 'outlined',
         name: 'lastName',
         value: 'lastName',
         required: true,
         textarea: true,
         type: "text"
      },
      {
         label: t('firstName'),
         variant: 'outlined',
         name: 'firstName',
         value: 'firstName',
         required: true,
         textarea: true,
         type: "text"
      },
      {
         label: t('fatherName'),
         variant: 'outlined',
         name: 'middleName',
         value: 'middleName',
         required: true,
         textarea: true,
         type: "text"
      },
      {
         label: t('ordering'),
         variant: 'outlined',
         name: 'ordering',
         value: 'ordering',
         required: true,
         textarea: true,
         type: "number"
      },
      {
         label: t('username'),
         variant: 'outlined',
         name: 'username',
         value: 'username',
         required: true,
         textarea: true,
         type: "text"
      },
      {
         label: t('password'),
         variant: 'outlined',
         name: 'password',
         value: 'password',
         required: true,
         textarea: true,
         type: "passwd"
      },
      {
         label: t('phoneNumber'),
         variant: 'outlined',
         name: 'phoneNumber',
         value: 'phoneNumber',
         required: true,
         textarea: true,
         type: "phone"
      },
      {
         label: t('birthDate'),
         variant: 'outlined',
         name: 'birthDate',
         value: 'birthDate',
         required: true,
         textarea: true,
         type: "date"
      }
   ];

   return (
      <div>
         {props.img ? <img src={props.img} alt="" onClick={handleOpen}/> :
            <Button btnType="addUser" clicked={handleOpen}>{t('add')}</Button>}
         <TransitionsModal open={open} handleClose={handleClose}>
            <div className={style.modal}>
               <p>{t('addUser')}</p>
               {loader === true ?
                  <div>
                     <Grid container spacing={3}>
                        {inputForm.map((data, index) =>
                           <Grid item xs={3} xl={3} className={style.colorAutocomplete}>
                              {data.textarea === true ?
                                 <TextField
                                    key={index}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                       className: classes.multilineColor
                                    }}
                                    className={classes.inputRoot}
                                    name={data.name}
                                    type={data.type}
                                    value={inputs[data.value] || null}
                                    onChange={props.editRule === true && data.name === 'value' ? '' : handleInputChange}
                                    label={data.label}
                                    InputLabelProps={{
                                       className: classes.label
                                    }}
                                 /> :
                                 <Autocomplete
                                    classes={classes}
                                    style={{width: '100%', marginRight: 27}}
                                    id="combo-box-demo"
                                    options={data.option}
                                    // defaultValue={props.updated === true ? data.option.find(v => v.id === inputs[data.name]) : ''}
                                    getOptionLabel={(option) => option[`${data.optionName}`]}
                                    onChange={(e, newValue) => handleInputComplete(e, newValue, data.name)}
                                    type={data.type}
                                    multiple={data.multiple}
                                    renderInput={(params) => <TextField
                                       {...params} label={data.label} variant="outlined"
                                       InputLabelProps={{className: style.label}}
                                       name={data.name}
                                       size="small"/>}
                                 />
                              }
                           </Grid>
                        )}
                     </Grid>
                     <Grid container spacing={3} className={style.gridContainer}>
                        <Grid item xs={5} xl={5}>
                           <p>{t('profilePicture')}</p>
                           <div className={style.circle}>
                              <img className={style.large} ref={uploadedImage}
                                   src={inputs.photoUrl ? inputs.photoUrl : user} alt=""/>
                              <div className={style.overlay}>
                                 <label htmlFor="file-input">
                                    <img src={camera} className={style.camera} alt="img"/>
                                 </label>
                                 <input style={{display: 'none'}} type="file" id="file-input"
                                        onChange={handleImageUpload} ref={imageUploader}/>
                              </div>
                           </div>
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
                                    value={field.email}
                                    label={'email'}
                                    onChange={(e) => handleInputChange(e, idx, 'contact')}
                                    InputLabelProps={{
                                       className: classes.label
                                    }}
                                    style={{width: '100%', marginRight: 27}}
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
                                    value={field.phoneNumber}
                                    onChange={(e) => handleInputChange(e, idx, 'contact')}
                                    InputLabelProps={{
                                       className: classes.label
                                    }}
                                    style={{width: '100%', marginRight: 27}}
                                 />
                                 {idx + 1 !== contact.length && contact.length > 1 ?
                                    <Button btnType="remove"
                                            clicked={() => handleRemoveContact(idx)}>-</Button> : ''}
                                 {idx + 1 === contact.length ?
                                    <Button btnType="add" clicked={() => handleAddContact()}>+</Button> : ''}
                              </div>
                           )}
                           <div className={style.action}>
                              <Button btnType="cancel" clicked={handleClose}>{t('cancel')}</Button>
                              <Button btnType="save" clicked={handleSubmitData}>{t('save')}</Button>
                           </div>
                        </Grid>
                     </Grid>
                  </div> : ''}
            </div>
         </TransitionsModal>
      </div>
   )
}