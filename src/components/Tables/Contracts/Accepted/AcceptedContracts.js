import React, {useContext, useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {Store} from "../../../../Store";
import style from "./accepted.module.css";
import axios from "../../../../API/api";
import Table from "../../Table";
import styles from "../../Applications/RecieveApplications/receiveApplications.module.css";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import ExpandMore from "@material-ui/icons/ExpandMore";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import otv from '../../../../assets/tables/otv.svg';
import checked from '../../../../assets/tables/checked.svg';
import cancel from '../../../../assets/tables/cancel.svg';
import eye from "../../../../assets/tables/eye.svg";
import pen from "../../../../assets/tables/pen.svg";
import minus from '../../../../assets/tables/minus.svg';

const useStyles = makeStyles(theme => ({
   inputRoot: {
      fontSize: 12,
      color: '#fff',
      height: 36,
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
   label: {
      color: '#fff',
      fontSize: 13
   },
}));

export default function AcceptedContratcs() {
   const classes = useStyles();
   const {t} = useTranslation();
   const {state, dispatch} = useContext(Store);
   const [mainData, setMainData] = useState([]);
   const [inputs, setInputs] = useState({});
   const [products, setProducts] = useState([]);
   const [organizations, setOrganiztions] = useState([]);
   const [organizationsTrue, setOrganizationsTrue] = useState([]);
   const [currency, setCurrency] = useState([]);
   const [supplier, setSupplier] = useState([]);
   const [totalCount, setTotalCount] = useState();

   useEffect(() => {
      let filter = '';
      if (inputs.bu) {
         filter += `&builderOrganizationId=${inputs.bu}`
      }
      if (inputs.pa) {
         filter += `&payerOrganizationId=${inputs.pa}`
      }
      if (inputs.pro) {
         filter += `&productId=${inputs.pro}`
      }
      if (inputs.cu) {
         filter += `&currencyTypeId=${inputs.cu}`
      }
      if (inputs.su) {
         filter += `&supplierId=${inputs.su}`
      }
      if (inputs.applicationNumber) {
         filter += `&applicationNumber=${inputs.applicationNumber}`
      }
      if (inputs.supplierInn) {
         filter += `&supplierInn=${inputs.supplierInn}`
      }
      if (inputs.contractNumber) {
         filter += `&contractNumber=${inputs.contractNumber}`
      }
      if (inputs.pro || state.page || state.perPage || inputs.bu || inputs.pa || inputs.cu || inputs.su ||
         inputs.applicationNumber || inputs.supplierInn || inputs.contractNumber) {
         axios.get(`/api/v1/contracts?page=${state.page}&perPage=${state.perPage}${filter}`, {headers: {Authorization: `Bearer ${state.token}`}})
            .then((res) => {
               setMainData(res.data.data)
               setTotalCount(res.data.totalCount)
            })
            .catch((err) => {
               console.log(err.response)
               if (err.response ? err.response.status === 401 : '') {
                  localStorage.removeItem('id_token');
                  return dispatch({type: 'SET_TOKEN', payload: ''})
               }
            })
      }
      if (products.length === 0 || organizations.length === 0) {
         Promise.all([
            axios.get(`/api/v1/organizations?myOrganizations=true`, {headers: {Authorization: `Bearer ${state.token}`}}),
            axios.get(`/api/v1/organizations`, {headers: {Authorization: `Bearer ${state.token}`}}),
            axios.get(`/api/v1/products`, {headers: {Authorization: `Bearer ${state.token}`}}),
            axios.get(`/api/v1/suppliers`, {headers: {Authorization: `Bearer ${state.token}`}}),
            axios.get(`/api/v1/types?typeCode=CURRENCY_TYPE`, {headers: {Authorization: `Bearer ${state.token}`}}),
         ]).then(function (res) {
            const orgTrue = res[0];
            const organizations = res[1];
            const products = res[2];
            const supplier = res[3];
            const currency = res[4];
            setOrganizationsTrue(orgTrue.data.data)
            setOrganiztions(organizations.data.data)
            setProducts(products.data.data)
            setSupplier(supplier.data.data)
            setCurrency(currency.data.data)
         }).catch((err) => {
            console.log(err.response)
            if (err.response ? err.response.status === 401 : '') {
               localStorage.removeItem('id_token');
               return dispatch({type: 'SET_TOKEN', payload: ''})
            }
         })
      }
   }, [state.updated, state.page, state.perPage, inputs.pro, inputs.su, inputs.bu,
      inputs.cu, inputs.pa, inputs.contractNumber, inputs.applicationNumber, inputs.supplierInn])

   const handleInputChange = (event) => {
      event.persist();
      const name = event.target.name;
      setInputs(inputs => ({...inputs, [name]: event.target.value}));
   }
   const handleInputComplete = (event, newValue, name) => {
      event.persist();
      if (name === 'productId') {
         setInputs(inputs => ({...inputs, ['pro']: newValue ? newValue.id : null}));
      } else if (name === 'builderOrganizationId') {
         setInputs(inputs => ({...inputs, ['bu']: newValue ? newValue.id : null}));
      } else if (name === 'payerOrganizationId') {
         setInputs(inputs => ({...inputs, ['pa']: newValue ? newValue.id : null}));
      } else if (name === 'supplierId') {
         setInputs(inputs => ({...inputs, ['su']: newValue ? newValue.id : null}));
      } else if (name === 'currencyTypeId') {
         setInputs(inputs => ({...inputs, ['cu']: newValue ? newValue.id : null}));
      }
   }

   function formatMoney(number) {
      return new Intl.NumberFormat('de-DE').format(number);
   }

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
         mainData,
      [t, mainData]
   )

   const autocompleteLabel = [
      {
         label: "Номер заявки",
         textArea: true,
         datePicker: false,
         name: 'applicationNumber',
         value: 'applicationNumber'
      },
      {
         label: "Номер контракта",
         textArea: true,
         datePicker: false,
         name: 'contractNumber',
         value: 'contractNumber'
      },
      {
         label: "ИНН",
         textArea: true,
         datePicker: false,
         name: 'supplierInn',
         value: 'supplierInn'
      },
      {
         label: "Организация",
         textArea: false,
         datePicker: false,
         option: organizationsTrue,
         name: 'builderOrganizationId',
         optionName: 'name'
      },
      {
         label: "Плательщик",
         textArea: false,
         datePicker: false,
         option: organizations,
         name: 'payerOrganizationId',
         optionName: 'name'
      },
      {
         label: "Поставщик",
         textArea: false,
         datePicker: false,
         option: supplier,
         name: 'supplierId',
         optionName: 'supplierName'
      },
      {
         label: "Продукт",
         textArea: false,
         datePicker: false,
         option: products,
         name: 'productId',
         optionName: 'name'
      },
      {
         label: "Тип валюты",
         textArea: false,
         datePicker: false,
         option: currency,
         name: 'currencyTypeId',
         optionName: 'name'
      },
   ]

   return (
      <div className={style.main}>
         <div className={style.top}>
            <p>Контракты</p>
         </div>
         <Grid container className={styles.grid} spacing={1}>
            {autocompleteLabel.map((element, index) => (
               <Grid item xs={3} xl={3} key={index}>
                  {element.textArea === false ?
                     <Autocomplete
                        classes={classes}
                        id="combo-box-demo"
                        options={element.option}
                        getOptionLabel={(option) => option[element.optionName]}
                        size="small"
                        name="orgName"
                        onChange={(e, newValue) => handleInputComplete(e, newValue, element.name)}
                        renderInput={(params) =>
                           <TextField {...params} label={element.label} InputLabelProps={{className: styles.label}}
                                      variant="outlined"/>}
                     /> : <TextField
                        variant="outlined"
                        size="small"
                        name={element.name}
                        type={element.name}
                        value={inputs[element.value] || null}
                        onChange={handleInputChange}
                        InputProps={{
                           className: classes.label
                        }}
                        className={classes.inputRoot}
                        label={element.label}
                        InputLabelProps={{
                           className: styles.label
                        }}
                     />}
               </Grid>
            ))}
         </Grid>
         <Table data={data} columns={columns} totalCount={totalCount}/>
      </div>
   )
}