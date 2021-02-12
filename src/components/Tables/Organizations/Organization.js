import React, {useContext, useEffect, useState} from 'react';
import Table from "../Table";
import style from './org.module.css';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import num from "../../../assets/tables/number.svg";
import mail from "../../../assets/tables/mail.svg";
import pen from "../../../assets/tables/pen.svg";
import trash from "../../../assets/tables/delete.svg";
import loc from '../../../assets/tables/location.svg';
import users from '../../../assets/tables/users.svg';
import phone from '../../../assets/tables/phone.svg';
import AddOrg from "./AddOrg";
import TableModal from "./TableModal";
import styles from './org.module.css';
import insta from "../../../assets/tables/instagram.svg";
import facebook from "../../../assets/tables/facebook.svg";
import telegram from "../../../assets/tables/telegram.svg";
import {Store} from "../../../Store";
import axios from "../../../API/api";
import {Grid} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
   inputRoot: {
      fontSize: 12,
      color: '#fff',
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

export default function Organization() {
   const classes = useStyles();
   const {t} = useTranslation();
   const {state, dispatch} = useContext(Store)
   const [mainData, setMainData] = useState([]);
   const [filteredData, setFilteredData] = useState([]);
   const [inputs, setInputs] = useState({});
   const [businessDireaction, setBusinessDirection] = useState([]);
   const [totalCount, setTotalCount] = useState();

   useEffect(() => {
      let filter = '';
      if (inputs.Bid) {
         filter += `&businessDirectionId=${inputs.Bid}`
      }
      if (inputs.Oid) {
         filter += `&selfId=${inputs.Oid}`
      }
      if (inputs.Oid || inputs.Bid) {
         axios.get(`/api/v1/organizations?page=${state.page}&perPage=${state.perPage}${filter}`,
            {headers: {Authorization: `Bearer ${state.token}`}})
            .then((res) => {
               setFilteredData(res.data.data)
               setTotalCount(res.data.totalCount)
            })
            .catch((err) => {
               console.log(err)
               if (err.response ? err.response.status === 401 : '') {
                  localStorage.removeItem('id_token');
                  return dispatch({type: 'SET_TOKEN', payload: ''})
               }
            })
      } else {
         Promise.all([
            axios.get(`/api/v1/organizations`, {headers: {Authorization: `Bearer ${state.token}`}}),
            axios.get(`/api/v1/business/directions`, {headers: {Authorization: `Bearer ${state.token}`}})
         ]).then(function (res) {
            const organizations = res[0];
            const bDirection = res[1];
            setMainData(organizations.data.data)
            setFilteredData(organizations.data.data)
            setBusinessDirection(bDirection.data.data)
            setTotalCount(organizations.data.totalCount)
         }).catch((err) => {
            console.log(err)
            if (err.response ? err.response.status === 401 : '') {
               localStorage.removeItem('id_token');
               return dispatch({type: 'SET_TOKEN', payload: ''})
            }
         })
      }
   }, [state.updated, inputs.Oid, inputs.Bid, state.page, state.perPage])

   const handleInputComplete = (event, newValue, name) => {
      event.persist();
      if (name === 'organizations') {
         setInputs(inputs => ({...inputs, ['Oid']: newValue ? newValue.id : null}));
      } else if (name === 'businessDirection') {
         setInputs(inputs => ({...inputs, ['Bid']: newValue ? newValue.id : null}));
      }
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
            Header: t('orgName'),
            accessor: 'name',
         },
         {
            Header: t('direction'),
            accessor: row => row.businessDirectionName,
         },
         {
            Header: t('address'),
            accessor: "address",
            Cell: (row) => {
               return <TableModal img={loc} users={'map'} title={'Адреса организации'}
                                  data={row.row.original.addresses}/>
            }
         },
         {
            Header: t('users'),
            accessor: 'nick',
            Cell: (row) => {
               return <TableModal img={users} users={'users'} id={row.row.original.id} title={t('employees')}/>
            }
         },
         {
            Header: t('telNumber'),
            accessor: row => 'contacts',
            Cell: (row) => {
               return <TableModal img={num} data={row.row.original.contacts} users={'number'} title={t('phoneNumUsers')}
                                  icon={phone} actions={[{img: insta}, {img: facebook}, {img: telegram}]}/>
            }
         },
         {
            Header: t('emailAdd'),
            accessor: 'financierUser.firstName',
            Cell: (row) => {
               return <TableModal img={mail} users={'email'} data={row.row.original.contacts} title={t('usersEmail')}
                                  alt=""/>
            }
         },
         {
            Header: t('action'),
            accessor: 'financierUser.lastName',
            Cell: (row) => {
               return <div className={style.action}>
                  <AddOrg img={pen} updateInfo={row.row.original} updated={true}
                          updatedUrl={'/api/v1/organization/update'}/>
                  <TableModal img={trash} data={'delete'} deleteId={row.row.original.id} title={t('delUser')}
                              url={'/api/v1/organization'}/>
               </div>
            }
         },
      ],
      [t]
   )

   const data = React.useMemo(
      () =>
         filteredData,
      [t, filteredData]
   )

   const filter = [
      {
         label: t('org'),
         name: 'organizations',
         value: 'organizations',
         option: mainData,
         optionName: 'name'
      },
      {
         label: t('businessDirection'),
         name: 'businessDirection',
         value: 'businessDirection',
         option: businessDireaction,
         optionName: 'name'
      },
   ]

   return (
      <div className={style.main}>
         <div className={style.top}>
            <p>{t('org')}</p>
            <AddOrg updated={false}/>
         </div>
         <Grid container spacing={2} className={style.filter}>
            {filter.map((element, i) =>
               <Grid item xs={4} xl={4}>
                  <Autocomplete
                     key={i}
                     classes={classes}
                     style={{marginBottom: 15}}
                     id="combo-box-demo"
                     options={element.option}
                     getOptionLabel={(option) => option[`${element.optionName}`]}
                     onChange={(e, newValue) => handleInputComplete(e, newValue, element.name)}
                     value={inputs[element.value]}
                     type={element.name}
                     renderInput={(params) => <TextField
                        {...params} label={element.label} variant="outlined"
                        InputLabelProps={{className: style.label}}
                        name={element.name}
                        size="small"/>}
                  />
               </Grid>
            )}
         </Grid>
         <Table data={data} columns={columns} totalCount={totalCount}/>
      </div>
   )
}