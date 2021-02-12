import React, {useState} from 'react';
import TransitionsModal from "../../../UI/Modal/Modal";
import Button from "../../../UI/Button/Button";
import style from "../../Users/users.module.css";
import close from "../../../../assets/tables/close.svg";
import Form from "../../../Form/Form";

export default function AddAccess(props) {
   const [open, setOpen] = useState(false);

   const handleOpen = () => {
      setOpen(true);
   }
   const handleClose = () => {
      setOpen(false);
   };

   const input = [
      {
         label: 'Code',
         variant: 'outlined',
         name: 'code',
         value: 'code',
         textArea: true,
         nested: false
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
               <h3>Добавить разрешение</h3>
               <img src={close} alt="" className={style.close} onClick={handleClose}/>
               <Form inputForm={input} type="single" xs={6} xl={6} url={'/api/v1/permissions/create'}
                     updateURL={'/api/v1/permissions/update'} updateInfo={props.data ? props.data : null}
                     handleClose={handleClose} sender={true} nested={'translations'}/>
            </div>
         </TransitionsModal>
      </div>
   )
}