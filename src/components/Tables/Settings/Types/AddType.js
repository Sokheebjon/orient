import React, {useState} from 'react';
import TransitionsModal from "../../../UI/Modal/Modal";
import style from "../../Users/users.module.css";
import Button from "../../../UI/Button/Button";
import {Grid} from "@material-ui/core";
import close from "../../../../assets/tables/close.svg";
import CheckBox from "../../../UI/Checkbox/CheckBox";
import Form from "../../../Form/Form";

export default function AddType(props) {

   const [open, setOpen] = useState(false);
   const [checkedItems, setCheckedItems] = useState({});

   const handleOpen = () => {
      setOpen(true);
   }
   const handleClose = () => {
      setOpen(false);
   };
   const handleChange = (event) => {
      setCheckedItems({[event.target.name]: event.target.checked})
   };

   const checkBox = [
      {
         name: "Parent Type",
         id: 1
      },
      {
         name: "Child Type",
         id: 2
      }
   ]
   const parent = [
      {
         label: 'Value',
         name: 'value',
         value: 'value',
         textArea: true,
      },
      {
         label: 'Name',
         name: 'name',
         value: 'name',
         textArea: true,
      },
      {
         label: 'Name En',
         name: 'nameEn',
         value: 'nameEn',
         textArea: true,
      },
      {
         label: 'Name Ru',
         name: 'nameRu',
         value: 'nameRu',
         textArea: true,
      },
      {
         label: 'Name Uz',
         name: 'nameUz',
         value: 'nameUz',
         textArea: true,
      },
   ]

   const child = [
      {
         label: 'Parent',
         name: 'parent',
         value: 'parent',
         textArea: false,
         option: props.maindata,
         optionName: 'value'
      },
      {
         label: 'Value',
         name: 'value',
         value: 'value',
         textArea: true,
      },
      {
         label: 'Name',
         name: 'name',
         value: 'name',
         textArea: true,
      },
      {
         label: 'Name En',
         name: 'nameEn',
         value: 'nameEn',
         textArea: true,
      },
      {
         label: 'Name Ru',
         name: 'nameRu',
         value: 'nameRu',
         textArea: true,
      },
      {
         label: 'Name Uz',
         name: 'nameUz',
         value: 'nameUz',
         textArea: true,
      },
   ]

   return (
      <div>
         {props.img ? <img src={props.img} alt="" onClick={handleOpen}/> :
            <Button btnType="addUser" clicked={handleOpen}>Добавить</Button>}
         <TransitionsModal open={open} handleClose={handleClose}>
            <div className={style.tableModal}>
               <h3>Add Type</h3>
               <img src={close} alt="" className={style.close} onClick={handleClose}/>
               {props.edit === true ? '' :
                  <Grid container spacing={3}>
                     {checkBox.map((e, i) =>
                        <Grid item xs={4} xl={4} className={style.input} key={i}>
                           <CheckBox label={e.name} name={e.id} checked={checkedItems[e.id]} onChange={handleChange}/>
                        </Grid>
                     )}
                  </Grid>
               }
               <hr className={style.hr}/>
               <Form inputForm={checkedItems[1] === true ? parent :
                  (checkedItems[2] === true) ? child : parent} type="single"
                     xs={6} xl={6} url={'/api/v1/types/create'} sender={true}
                     updateURL={'/api/v1/types/update'} updateInfo={props.data ? props.data : null}
                     handleClose={handleClose} editRule={props.editRule}/>
            </div>
         </TransitionsModal>
      </div>
   )
}