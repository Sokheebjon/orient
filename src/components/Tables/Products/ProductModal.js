import React, {useContext, useEffect, useState} from 'react';
import TransitionsModal from "../../UI/Modal/Modal";
import Button from "../../UI/Button/Button";
import style from "../Users/users.module.css";
import close from "../../../assets/tables/close.svg";
import {makeStyles} from "@material-ui/core/styles";
import axios from "../../../API/api";
import {Store} from "../../../Store";
import {Grid} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(theme => ({
   inputRoot: {
      fontSize: 12,
      color: '#fff',
      minHeight: 40,
      width: '100%',
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
}));

export default function ProductsModal(props) {
   const classes = useStyles();
   const {t} = useTranslation();
   const {state, dispatch} = useContext(Store);
   const [open, setOpen] = useState(false);
   const [categories, setCategories] = useState([]);
   const [inputs, setInputs] = useState(props.data ? props.data : {});

   useEffect(() => {
      if (open === true) {
         Promise.all([
            axios.get(`/api/v1/product/categories`, {headers: {Authorization: `Bearer ${state.token}`}})
         ]).then(function (res) {
            const categories = res[0];
            setCategories(categories.data.data)
         }).catch((err) => {
            console.log(err)
            if (err.response ? err.response.status === 401 : '') {
               localStorage.removeItem('id_token');
               return dispatch({type: 'SET_TOKEN', payload: ''})
            }
         })
      }
   }, [state.updated, open])

   const handleOpen = () => {
      setOpen(true);
   }
   const handleClose = () => {
      setOpen(false);
   };

   const handleInputComplete = (event, newValue, name) => {
      event.persist();
      if (name === 'productCategoryId') {
         setInputs(inputs => ({...inputs, ['productCategoryId']: newValue ? newValue.id : null}));
      }
   }
   const handleInputChange = (event) => {
      const {name} = event.target;
      setInputs(inputs => ({...inputs, [name]: event.target.value}));
   }

   const handleSubmitSingle = (e) => {
      e.preventDefault();
      let create = {
         "name": inputs.name,
         "productCategoryId": inputs.productCategoryId
      }
      let update = {
         "id": inputs.id,
         "name": inputs.name,
         "productCategoryId": inputs.productCategoryId
      }
      let categoryCreate = {
         "name": inputs.name
      }

      axios[props.updated === true ? 'put' : 'post'](props.updated === true ? props.updatedUrl : props.postUrl,
         props.updated === true ? update : (props.category === true ? categoryCreate : create), {headers: {Authorization: `Bearer ${state.token}`}})
         .then(response => {
            console.log(response)
            if (response.status === 201 || 200) {
               handleClose()
               return dispatch({type: 'UPDATED', payload: Math.random()})
            }
         })
         .catch(function (error) {
            console.log(error.response)
         })
   }

   return (
      <div>
         {props.img ? <img src={props.img} alt="" onClick={handleOpen}/> :
            <Button btnType="addUser" clicked={handleOpen}>Добавить</Button>}
         <TransitionsModal open={open} handleClose={handleClose}>
            <div className={style.tableModal} onSubmit={handleSubmitSingle}>
               <h3>{props.title}</h3>
               <img src={close} alt="" className={style.close} onClick={handleClose}/>
               <Grid container spacing={3}>
                  <Grid item xs={6} xl={6} className={style.colorAutocomplete}>
                     <TextField
                        variant="outlined"
                        size="small"
                        InputProps={{
                           className: classes.multilineColor
                        }}
                        className={classes.inputRoot}
                        name={'name'}
                        value={inputs['name']}
                        onChange={(e) => handleInputChange(e)}
                        label={'Название продукта'}
                        InputLabelProps={{
                           className: classes.label
                        }}
                     />
                  </Grid>
                  {props.category === true || props.id ? '' :
                     <Grid item xs={6} xl={6} className={style.colorAutocomplete}>
                        <Autocomplete
                           classes={classes}
                           style={{width: '100%', marginRight: 27}}
                           id="combo-box-demo"
                           options={categories}
                           defaultValue={props.updated === true ? categories.find(v => v.name === inputs.productCategoryName) : ''}
                           getOptionLabel={(option) => option.name}
                           onChange={(e, newValue) =>
                              handleInputComplete(e, newValue, 'productCategoryId')}
                           renderInput={(params) => <TextField
                              {...params} label={'Категория'} variant="outlined"
                              InputLabelProps={{className: style.label}}
                              name={'category'}
                              size="small"/>}
                        />
                     </Grid>
                  }
               </Grid>
               <div className={style.action}>
                  <Button btnType="cancel" clicked={handleClose}>{t('cancel')}</Button>
                  <Button btnType="save" clicked={handleSubmitSingle}>{t('save')}</Button>
               </div>
            </div>
         </TransitionsModal>
      </div>
   )
}