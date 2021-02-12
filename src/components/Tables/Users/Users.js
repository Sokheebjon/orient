import React, {useContext, useEffect, useState} from 'react';
import Table from "../Table";
import style from './users.module.css';
import {useTranslation} from "react-i18next";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import AddUser from "./AddUser";
import TableModal from "./TableModal";
import num from '../../../assets/tables/number.svg';
import mail from '../../../assets/tables/mail.svg';
import status from '../../../assets/tables/status.svg';
import time from '../../../assets/tables/time.svg';
import pen from '../../../assets/tables/pen.svg';
import trash from '../../../assets/tables/delete.svg';
import phone from '../../../assets/tables/phone.svg';
import insta from '../../../assets/tables/instagram.svg';
import facebook from '../../../assets/tables/facebook.svg';
import telegram from '../../../assets/tables/telegram.svg';
import {Store} from "../../../Store";
import axios from '../../../API/api';
import Tooltip from '@material-ui/core/Tooltip'
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


export default function Users() {
   const classes = useStyles();
   const {t} = useTranslation();
   const [filteredData, setFilteredData] = useState([]);
   const {state, dispatch} = useContext(Store);
   const [mainData, setMainData] = useState([]);
   const [inputId, setInputID] = useState({});
   const [orgData, setOrgData] = useState([]);


   useEffect(() => {
      if (inputId.Oid || inputId.Uid) {
         Promise.all([
            axios.get(inputId.Uid && inputId.Oid ? `/api/v1/users?myUsers=true&organizationId=${inputId.Oid}&selfId=${inputId.Uid}`
               : (inputId.Uid ? `/api/v1/users?myUsers=true&selfId=${inputId.Uid}` : `/api/v1/users?myUsers=true&organizationId=${inputId.Oid}`), {headers: {Authorization: `Bearer ${state.token}`}})
         ]).then(function (res) {
            const users = res[0]
            setFilteredData(users.data.data);
         }).catch((err) => {
            console.log(err);
            if (err.response ? err.response.status === 401 : null) {
               localStorage.removeItem('id_token');
               return dispatch({type: 'SET_TOKEN', payload: ''})
            }
         })
      } else {
         Promise.all([
            axios.get(`/api/v1/users?myUsers=true`, {headers: {Authorization: `Bearer ${state.token}`}}),
            axios.get(`api/v1/organizations?myOrganizations=true`, {headers: {Authorization: `Bearer ${state.token}`}})
         ]).then(function (res) {
            const users = res[0];
            const org = res[1];
            setMainData(users.data.data)
            setFilteredData(users.data.data)
            setOrgData(org.data.data)
         }).catch((err) => {
            console.log(err);
            if (err.response ? err.response.status === 401 : null) {
               localStorage.removeItem('id_token');
               return dispatch({type: 'SET_TOKEN', payload: ''})
            }
         })
      }
   }, [state.updated, inputId.Oid, inputId.Uid])

   const handleInputComplete = (event, newValue, name) => {
      event.persist();
      if (name === 'users') {
         setInputID(inputId => ({...inputId, ['Uid']: newValue ? newValue.id : null}));
         // console.log(inputId.Uid)
      } else if (name === "organizations") {
         setInputID(inputId => ({...inputId, ['Oid']: newValue ? newValue.id : null}))
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
            Header: t('NameSurMidName'),
            accessor: 'name',
            Cell: (row => {
               return <p
                  className={style.fullName}>{row.row.original.firstName} {row.row.original.lastName} {row.row.original.middleName}</p>
            })
         },
         {
            Header: t('org'),
            accessor: 'org',
            Cell: (row => {
               return (row.row.original.organizations.length <= 1 ?
                     <p className={style.fullName}>{row.row.original.organizations[0].name}</p>
                     :
                     <div>
                        <Tooltip title={row.row.original.organizations.map(e =>
                           (<small className={style.tooltip}>{e.name},</small>))} placement="top" arrow>
                           <p className={style.fullName}>{row.row.original.organizations[0].name} ...</p>
                        </Tooltip>
                     </div>
               )
            })
         },
         {
            Header: t('position'),
            accessor: 'position',
            Cell: (row => {
               return <p className={style.fullName}>{row.row.original.positionTypeName}</p>
            })
         },
         {
            Header: t('telNumber'),
            accessor: 'num',
            Cell: (row) => {
               return <TableModal data={row.value} img={num} title={t('phoneNumUsers')}
                                  icon={phone} actions={[{img: insta}, {img: facebook}, {img: telegram}]}
               />
            }
         },
         {
            Header: t('emailAdd'),
            accessor: 'mail',
            Cell: (row) => {
               return <TableModal data={row.value} img={mail} title={t('usersEmail')}/>
            }
         },
         {
            Header: t('status'),
            accessor: '',
            Cell: (row) => {
               return <img src={status} alt=""/>
            }
         },
         {
            Header: t('action'),
            accessor: 'action',
            Cell: (row) => {
               return <div className={style.TakeAction}>
                  <TableModal img={time} data={row.value} title={t('historyActions')}/>
                  <AddUser img={pen} id={row.row.original.id} updated={true}/>
                  <TableModal img={trash} data={'delete'} title={t('delUser')}/>
               </div>
            }
         },
      ],
      [t],
   )

   const data = React.useMemo(
      () => filteredData,
      [t, filteredData]
   )

   const filter = [
      {
         label: t('users'),
         name: 'users',
         value: 'users',
         option: mainData,
         optionName: 'name'
      },
      {
         label: t('organizations'),
         name: 'organizations',
         value: 'organizations',
         option: orgData,
         optionName: 'name'
      }
   ]


   return (
      <div className={style.main}>
         <div className={style.top}>
            <p>{t('users')}</p>
            <AddUser updated={false}/>
         </div>
         <Grid container spacing={3} className={style.filter}>
            {filter.map((element, i) =>
               <Grid item xs={4} xl={4}>
                  <Autocomplete
                     key={i}
                     classes={classes}
                     style={{marginBottom: 20}}
                     options={element.option}
                     getOptionLabel={(option) => element.name === "users" ? option.firstName : option.name}
                     onChange={(e, newValue) => handleInputComplete(e, newValue, element.name)}
                     renderInput={(params) => <TextField
                        {...params} label={element.label} variant="outlined"
                        InputLabelProps={{className: style.label}}
                        name={element.name}
                        size="small"/>}
                  />
               </Grid>
            )}
         </Grid>
         <Table data={data} columns={columns}/>
      </div>
   )
}