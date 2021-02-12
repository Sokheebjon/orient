import React, {useContext, useEffect, useState} from 'react';
import styles from "./receiveApplications.module.css";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import style from './receiveApplications.module.css';
import axios from '../../../../API/api';
import {Store} from "../../../../Store";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableModal from "./TableModal";

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

const StyledTableRow = withStyles((theme) => ({
   root: {
      backgroundColor: '#2B2B2B',
   },
}))(TableRow);
const StyledTableCell = withStyles((theme) => ({
   head: {
      backgroundColor: '#566EE9',
      color: theme.palette.common.white,
      fontSize: 11,
      border: '1px solid rgba(255, 255, 255, 0.3)',
   },
   body: {
      fontSize: 11,
      color: theme.palette.common.white,
      border: '1px solid rgba(255, 255, 255, 0.3)'
   },
}))(TableCell);

export default function MoreDetail(props) {
   const classes = useStyles();
   const {state, dispatch} = useContext(Store);
   const [inputs, setInputs] = useState({});

   useEffect(() => {
      axios.get(`/api/v1/application/${props.row.id}`, {headers: {Authorization: `Bearer ${state.token}`}})
         .then((res) => {
            setInputs(res.data.data)
         })
         .catch((err) => {
            console.log(err)
            if (err.response ? err.response.status === 401 : '') {
               localStorage.removeItem('id_token');
               return dispatch({type: 'SET_TOKEN', payload: ''})
            }
         })
   }, [state.updated])

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
      <div className={style.moreDetails}>
         <Grid container className={styles.grid} spacing={1}>
            {form.map((element, index) =>
               <Grid item xs={3} xl={3} style={inputs[element.value] ? {display: 'flex'} : {display: 'none'}}
                     key={index}>
                  <TextField
                     variant="outlined"
                     size="small"
                     name={element.name}
                     type={element.name}
                     value={inputs[element.value] || 'не указано'}
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
         <p className={styles.info}>Ответственные лица</p>
         <div>
            {inputs.responsibleUsers ? inputs.responsibleUsers.map((element, i) =>
               <p style={{display: 'flex', alignItems: 'center'}} key={i}> -
                  <TableModal label={<p style={{
                     color: '#5698FF',
                     marginRight: 3,
                     cursor: 'pointer'
                  }}> {element.firstName} {element.lastName} {element.middleName} </p>}
                              title={"Пользователь"} id={element.userId}
                              img="https://image.shutterstock.com/image-vector/young-man-avatar-character-260nw-661669825.jpg"
                  /> {element.responsibleTypeName}</p>
            ) : ''}
         </div>
         <p className={styles.info}>Информация о товарах</p>
         <TableContainer>
            <Table className={classes.table} aria-label="customized table" size={'small'} color="primary">
               <TableHead>
                  <TableRow>
                     <StyledTableCell>№</StyledTableCell>
                     <StyledTableCell align="center">Наименование товара</StyledTableCell>
                     <StyledTableCell align="center">Тип</StyledTableCell>
                     <StyledTableCell align="center">Модель</StyledTableCell>
                     <StyledTableCell align="center">Количество</StyledTableCell>
                     <StyledTableCell align="center">Ед измерения</StyledTableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {inputs.applicationItems ? inputs.applicationItems.map((row, i) => (
                     <StyledTableRow key={row.name}>
                        <StyledTableCell component="th" scope="row">{i + 1}</StyledTableCell>
                        <StyledTableCell align="center">{row.productName}</StyledTableCell>
                        <StyledTableCell align="center">{row.productTypeName}</StyledTableCell>
                        <StyledTableCell align="center">{row.productModelName}</StyledTableCell>
                        <StyledTableCell align="center">{row.count}</StyledTableCell>
                        <StyledTableCell align="center">{row.unitTypeName}</StyledTableCell>
                     </StyledTableRow>
                  )) : ''}
               </TableBody>
            </Table>
         </TableContainer>
      </div>
   )
}