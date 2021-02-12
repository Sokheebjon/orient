import React, {useContext, useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Grid from '@material-ui/core/Grid'
import Timer from 'react-compound-timer';
import ExpandMore from '@material-ui/icons/ExpandMore';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import minus from '../../../../assets/tables/minus.svg';
import Table from "../../Table.js"
import styles from './receiveApplications.module.css';
import tick from "../../../../assets/images/tick.svg";
import cancel from '../../../../assets/tables/cancel.svg';
import eye from "../../../../assets/tables/eye.svg";
import {useTranslation} from "react-i18next";
import TableModal from "./TableModal";
import axios from "../../../../API/api";
import {Store} from "../../../../Store";
import pen from "../../../../assets/tables/pen.svg";
import style from "../../Organizations/org.module.css";
import UpdatedApplication from "./UpdateApplication";
import ContractModal from "./ContractModal";

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
   label: {
      color: '#fff',
      fontSize: 13
   },
}))

export default function ReceiveApplications({columns: userColumns, otherData}) {
   const classes = useStyles();
   const {t} = useTranslation();
   const {state, dispatch} = useContext(Store);
   const [mainData, setMainData] = useState([]);
   const [totalCount, setTotalCount] = useState();
   const [organizationsTrue, setOrganizationsTrue] = useState([]);
   const [organizations, setOrganiztions] = useState([]);
   const [products, setProducts] = useState([]);
   const [inputs, setInputs] = useState({});
   const [typeCode, setTypeCode] = useState([]);
   const [objects, setObjects] = useState([]);

   useEffect(() => {
      let filter = '';
      if (inputs.bu) {
         filter += `&builderOrganizationId=${inputs.bu}`
      }
      if (inputs.pa) {
         filter += `&payerOrganizationId=${inputs.pa}`
      }
      if (inputs.applicationNumber) {
         filter += `&applicationNumber=${inputs.applicationNumber}`
      }
      if (inputs.pro) {
         filter += `&productId=${inputs.pro}`
      }
      if (inputs.bu || inputs.pa || inputs.applicationNumber || inputs.pro || state.page || state.perPage) {
         axios.get(`/api/v1/applications?page=${state.page}&perPage=${state.perPage}${filter}`, {headers: {Authorization: `Bearer ${state.token}`}})
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
            axios.get(`/api/v1/types?typeCode=UNIT_TYPE`, {headers: {Authorization: `Bearer ${state.token}`}}),
            axios.get(`/api/v1/objects`, {headers: {Authorization: `Bearer ${state.token}`}}),
         ]).then(function (res) {
            const orgTrue = res[0];
            const organizations = res[1];
            const products = res[2];
            const typeCode = res[3];
            const objects = res[4]
            setOrganizationsTrue(orgTrue.data.data)
            setOrganiztions(organizations.data.data)
            setProducts(products.data.data)
            setTypeCode(typeCode.data.data)
            setObjects(objects.data.data)
         }).catch((err) => {
            console.log(err.response)
            if (err.response ? err.response.status === 401 : '') {
               localStorage.removeItem('id_token');
               return dispatch({type: 'SET_TOKEN', payload: ''})
            }
         })
      }
   }, [state.updated, state.page, state.perPage, inputs.applicationNumber, inputs.pro, inputs.bu, inputs.pa])

   const handleInputChange = (event) => {
      event.persist();
      const name = event.target.name;
      setInputs(inputs => ({...inputs, [name]: event.target.value}));
      return dispatch({type: 'PAGE', payload: 0})
   }
   const handleInputComplete = (event, newValue, name) => {
      event.persist();
      if (name === 'productId') {
         setInputs(inputs => ({...inputs, ['pro']: newValue ? newValue.id : null}));
      } else if (name === 'builderOrganizationId') {
         setInputs(inputs => ({...inputs, ['bu']: newValue ? newValue.id : null}));
      } else if (name === 'payerOrganizationId') {
         setInputs(inputs => ({...inputs, ['pa']: newValue ? newValue.id : null}));
      }
      return dispatch({type: 'PAGE', payload: 0})
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
            Header: t('number'),
            accessor: 'applicationNumber',
         },
         {
            Header: t('customer'),
            accessor: 'builderOrganizationName'
         },
         {
            Header: t('whoApplied'),
            accessor: 'createdByName',
            Cell: props =>
               <TableModal label={"Ильнур Янбухтин"} title={"Пользователь"} id={props.row.original.createdBy}
                           img="https://image.shutterstock.com/image-vector/young-man-avatar-character-260nw-661669825.jpg"
               />
         },
         {
            Header: t('commercialOffer'),
            accessor: 'commercialOffer',
            Cell: (row) => {
               return (
                  <p className={styles.commercialOffer}>{row.value}</p>
               )
            }
         },
         {
            Header: t('contract'),
            accessor: 'contract',
            Cell: (row) => {
               return (
                  <div>
                     <ContractModal data={row.row.original}/>
                  </div>
               )
            }
         },
         {
            Header: t('genDirector'),
            accessor: "genDirector",
            Cell: (row) => {
               return (
                  <img src={row.value === true ? tick : (row.value === false ? cancel : minus)} alt="" width={20}/>
               )
            }
         },
         {
            Header: t('szk'),
            accessor: "szk",
            Cell: (row) => {
               return (
                  <img src={row.value === true ? tick : (row.value === false ? cancel : minus)} alt="" width={20}/>
               )
            }
         },
         {
            Header: t('date'),
            accessor: 'applicationDate',
         },
         {
            Header: t('deadline'),
            accessor: 'deadline',
            Cell: (row) => {
               return (
                  <div className={styles.deadlineOn}>
                     <Timer
                        initialTime={6000000 * 60 * 48 + 5000}
                        direction="backward"
                        formatValue={(value) => `${(value < 10 ? `0${value}` : value)}`}
                     >
                        {() => (
                           <React.Fragment>
                              <Timer.Days/> <small style={{color: '#2AD43B', fontSize: 10}}>Д </small>
                              <Timer.Hours/>:
                              <Timer.Minutes/>:
                              <Timer.Seconds/>
                           </React.Fragment>
                        )}
                     </Timer>
                  </div>
               )
            }
         },
         {
            Header: t('status'),
            accessor: 'statusName',
            Cell: (row) => {
               return (
                  <p className={styles.statusOn}>{row.value}</p>
               )
            }
         },
         {
            Header: t('action'),
            accessor: 'action',
            Cell: (row) => {
               return (
                  <div className={style.action}>
                     <img src={eye} alt=""/>
                     <UpdatedApplication img={pen} id={row.row.original.id}
                                         org={organizations} orgTrue={organizationsTrue} pro={products}
                                         typeCode={typeCode} obj={objects}/>
                  </div>
               )
            }
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
      [t, mainData, organizationsTrue, organizations, products, objects, typeCode],
   )
   const data = React.useMemo(
      () => mainData,
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
         label: "Покупатель",
         textArea: false,
         datePicker: false,
         option: organizationsTrue,
         name: 'builderOrganizationId'
      },
      {
         label: "Плательщик",
         textArea: false,
         datePicker: false,
         option: organizations,
         name: 'payerOrganizationId'
      },
      {
         label: "Наименование товара",
         textArea: false,
         datePicker: false,
         option: products,
         name: 'productId'
      },
   ]

   return (
      <div className={styles.main}>
         <p className={styles.top}>Принятые заявки</p>
         <Grid container className={styles.grid} spacing={1}>
            {autocompleteLabel.map((element, index) => (
               <Grid item xs={3} xl={3} key={index}>
                  {element.textArea === false ?
                     <Autocomplete
                        classes={classes}
                        id="combo-box-demo"
                        options={element.option}
                        getOptionLabel={(option) => option.name}
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

