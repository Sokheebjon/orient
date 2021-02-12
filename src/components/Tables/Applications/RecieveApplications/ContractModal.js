import React, {useContext, useEffect, useState} from 'react';
import TransitionsModal from "../../../UI/Modal/Modal";
import style from "./receiveApplications.module.css";
import {Store} from "../../../../Store";
import {useTranslation} from "react-i18next";
import axios from "../../../../API/api";
import styles from "./receiveApplications.module.css";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import otv from "../../../../assets/tables/otv.svg";
import checked from "../../../../assets/tables/checked.svg";
import cancel from "../../../../assets/tables/cancel.svg";
import minus from "../../../../assets/tables/minus.svg";
import eye from "../../../../assets/tables/eye.svg";
import pen from "../../../../assets/tables/pen.svg";
import ExpandMore from "@material-ui/icons/ExpandMore";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import Table from "../../Table";
import Button from "../../../UI/Button/Button";
import AddContract from "../../Contracts/AddContract/AddContract";

const useStyles = makeStyles(theme => ({
   inputRoot: {
      fontSize: 12,
      color: "#fff",
      minHeight: 35,
      fontFamily: "Montserrat",
      width: "100%",
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
   table: {
      width: 'auto',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: 5,
      margin: 'auto'
   },
   label: {
      color: '#fff',
      fontSize: 13
   },
}))

export default function ContractModal(props) {
   const classes = useStyles();
   const [open, setOpen] = useState(false);
   const {state, dispatch} = useContext(Store);
   const [contract, setContract] = useState([]);
   const [application, setApplication] = useState([]);
   const {t} = useTranslation();

   useEffect(() => {
      if (open === true) {
         Promise.all([
            axios.get(`/api/v1/contracts?applicationId=${props.data.id}`, {headers: {Authorization: `Bearer ${state.token}`}}),
            axios.get(`/api/v1/application/${props.data.id}`, {headers: {Authorization: `Bearer ${state.token}`}}),
         ]).then(function (res) {
            const contracts = res[0];
            const application = res[1];
            setContract(contracts.data.data);
            setApplication(application.data.data);
         }).catch((err) => {
            console.log(err.response)
            if (err.response ? err.response.status === 401 : '') {
               localStorage.removeItem('id_token');
               return dispatch({type: 'SET_TOKEN', payload: ''})
            }
         })
      }
   }, [state.updated, props.id, open])

   function formatMoney(number) {
      return new Intl.NumberFormat('de-DE').format(number);
   }

   const handleOpen = () => {
      setOpen(true);
   }

   const handleClose = () => {
      setOpen(false);
   };

   const columns = React.useMemo(
      () => [
         {
            Header: '№',
            accessor: 'id',
            Width: 10,
            Cell: ({row}) => {
               return row.index + 1
            }
         },
         {
            Header: 'Номер контракта',
            accessor: 'contractNumber',
         },
         {
            Header: 'Номер заявки',
            accessor: 'applicationNumber',
            Cell: (row) => (
               <p className={style.applicationNumber}>{row.row.original.applicationNumber}</p>
            )
         },
         {
            Header: 'Покупатель',
            accessor: 'builderOrganizationName',
         },
         {
            Header: 'Кто подал контраткы',
            accessor: 'createdUser',
         },
         {
            Header: 'Сумма(без НДС)',
            accessor: 'totalAmount',
            Cell: (row) => (
               <p className={style.number}>{formatMoney(row.row.original.totalAmount)}</p>
            )
         },
         {
            Header: 'Сумма(с НДС)',
            accessor: 'totalAmountWithVat',
            Cell: (row) => (
               <p className={style.number}>{formatMoney(row.row.original.totalAmountWithVat)}</p>
            )
         },
         {
            Header: 'Тип валюты',
            accessor: 'currencyTypeName',
         },
         {
            Header: 'Дата создания',
            accessor: 'createdDate',
         },
         {
            Header: 'Статус подтверждения',
            accessor: 'contractStatusName',
            Cell: (row) => (
               <p className={style.contractStatus}>{row.row.original.contractStatusName}</p>
            )
         },
         {
            Header: 'Статус платежа',
            accessor: 'paymentStatusName',
            Cell: (row) => (
               <p className={style.paymentStatus}>Не оплачено</p>
            )
         },
         {
            Header: 'Отв. лица',
            Cell: (row) => (
               <img src={otv} alt=""/>
            )
         },
         {
            Header: 'Ген.Дир',
            accessor: 'isDirectorChecked',
            Cell: (row) => (
               <img src={checked} alt="" width={20}/>
            )
         },
         {
            Header: 'ЦЗК',
            accessor: 'isAdminChecked',
            Cell: (row) => (
               <img src={cancel} alt="" width={25} style={{margin: 0}}/>
            )
         },
         {
            Header: 'Ответственные',
            accessor: 'isResponsibleUserChecked',
            Cell: (row) => (
               <img src={minus} alt="" width={20}/>
            )
         },
         {
            Header: t('action'),
            Cell: (row) => (
               <div className={style.action}>
                  <img src={eye} alt=""/>
                  <img src={pen} alt=""/>
               </div>
            )
         },
         {
            Header: "Подробнее",
            accessor: "more",
            id: 'expander',
            Cell: ({row}) => (
               <span {...row.getToggleRowExpandedProps()}>
                  {row.isExpanded ? <ExpandMore/> : <KeyboardArrowRightIcon/>}
               </span>
            )
         },
      ],
      [t]
   )

   const data = React.useMemo(
      () =>
         contract,
      [t, contract]
   )

   const form = [
      {
         label: '№ заявки',
         name: 'applicationNumber',
         value: 'applicationNumber'
      },
      {
         label: 'Дата создания',
         name: 'applicationDate',
         value: 'applicationDate'
      },
      {
         label: 'Покупатель',
         name: 'builderOrganizationName',
         value: 'builderOrganizationName'
      },
      {
         label: 'Плательщик',
         name: 'payerOrganizationName',
         value: 'payerOrganizationName'
      },
      {
         label: 'Название объекта',
         name: 'objectName',
         value: 'objectName',
      },
   ]

   return (
      <div>
         <p className={style.contract} onClick={handleOpen}>5</p>
         <TransitionsModal open={open} handleClose={handleClose}>
            <div className={style.tableModal} style={{width: '90%', margin: '5%'}}>
               <div className={style.add}>
                  <h3>Контракты</h3>
                  <AddContract id={props.data.id}/>
               </div>
               <Grid container className={styles.grid} spacing={2}>
                  {form.map((element, index) =>
                     <Grid item xs={3} xl={3} style={application[element.value] ? {display: 'flex'} : {display: 'none'}}
                           key={index}>
                        <TextField
                           variant="outlined"
                           size="small"
                           name={element.name}
                           type={element.name}
                           value={application[element.value] || 'не указано'}
                           InputProps={{
                              className: classes.label,
                              readOnly: true
                           }}
                           className={classes.inputRoot}
                           label={element.label}
                           InputLabelProps={{
                              className: styles.label
                           }}
                        />
                     </Grid>
                  )}
               </Grid>
               <Table data={data} columns={columns}/>
            </div>
         </TransitionsModal>
      </div>
   )
}

