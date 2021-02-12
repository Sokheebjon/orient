import React, {useContext, useEffect, useState} from 'react';
import {useTable, useSortBy} from 'react-table';
import style from './resolution.module.css';
import sort from '../../../../assets/tables/sort.svg';
import CheckBox from "../../../UI/Checkbox/CheckBox";
import axios from "../../../../API/api";
import {Store} from "../../../../Store";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import Pagination from "../../Pagination/Pagination";

const useStyles = makeStyles(theme => ({
   inputRoot: {
      margin: -8,
      fontSize: 12,
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
         borderColor: "#000",
         color: '#fff'
      },
      '& label.Mui-focused': {
         color: 'white',
      },
      "&:focus .MuiOutlinedInput-notchedOutline": {
         borderWidth: "1px",
         borderColor: "#000",
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
}));

export default function ResolutionTable(props) {
   const classes = useStyles();
   const {state, dispatch} = useContext(Store)
   const [column, setColumn] = useState([]);
   const [row, setRow] = useState([]);
   const [page, setPage] = React.useState(0);
   const [perPage, setPerPage] = useState(10);
   const [totalCount, setTotalCount] = useState();

   useEffect(() => {
      Promise.all([
         axios.get(`/api/v1/permissions/access?page=${page}&perPage=${perPage}`, {headers: {Authorization: `Bearer ${state.token}`}}),
         axios.get(`/api/v1/roles`, {headers: {Authorization: `Bearer ${state.token}`}})
      ]).then(function (results) {
         const column = results[0];
         const row = results[1];
         setColumn(column.data.data)
         setRow(row.data.data)
         setTotalCount(column.data.totalCount)
      }).catch((err) => {
         console.log(err)
         if(err.response ? err.response.status === 401: ''){
            localStorage.removeItem('id_token');
            return dispatch({type: 'SET_TOKEN', payload: ''})
         }
      })
   }, [state.updated, page, perPage])

   const handleClick = (row, col, e) => {
      let data = {
         "attach": e.target.checked,
         "permissionId": row,
         "roleId": col
      }
      axios.post(`/api/v1/roles/attach`, data, {headers: {Authorization: `Bearer ${state.token}`}}
      ).then(function (results) {
         return dispatch({type: 'UPDATED', payload: Math.random()})
      }).catch((err) => {
         console.log(err.response)
         if(err.response ? err.response.status === 401: ''){
            localStorage.removeItem('id_token');
            return dispatch({type: 'SET_TOKEN', payload: ''})
         }
      })
   }
   const col = [
      {
         code: '№',
         accessor: 'id',
         Width: 10,
         Cell: ({row}) => {
            return row.index + 1
         }
      },
      {
         code: <TextField id="outlined-basic" label="Permission name" variant="outlined" size="small"
                          InputLabelProps={{className: classes.label}} InputProps={{className: classes.input}}
                          className={classes.inputRoot}/>,
         accessor: 'code',
         Width: 200
      },
   ]
   Array.prototype.push.apply(col, row)
   const columns = React.useMemo(
      () => col,
      [row],
   )

   const data = React.useMemo(
      () => column,
      [column]
   )
   const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
   } = useTable({columns: columns, data: data}, useSortBy)

   return (
      <div>
         <table {...getTableProps()} className={style.table}>
            {props.header !== false ?
               <thead className={style.thead}>
               {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                     {headerGroup.headers.map(column => (
                        <th className={style.th}
                            width={column.Width}>
                           {column.render('code')}
                           {column.permissions ? column.render(<CheckBox checked={true}/>) : ''}
                        </th>
                     ))}
                  </tr>
               ))}
               </thead>
               : ''}
            <tbody {...getTableBodyProps()} className={style.tbody}>
            {rows.map(row => {
               prepareRow(row)
               return (
                  <tr onClick={props.onClick ? () => props.onClick(row) : null} {...row.getRowProps()}
                      className={style.tr} tabIndex="0">
                     {row.cells.map(cell => {
                        return (
                           <td {...cell.getCellProps()} className={style.td}>
                              {cell.render('Cell')}
                              {cell.column.permissions ? cell.column.render(<CheckBox
                                 checked={cell.row.original.roles ?
                                    Array.from(cell.row.original.roles.split(',')).includes(JSON.stringify(cell.column.id)) : ''}
                                 onChange={(e) => handleClick(cell.row.original.id, cell.column.id, e)}
                              />) : false}
                           </td>
                        )
                     })}
                  </tr>
               )
            })}
            </tbody>
         </table>
         {data.length !== 0 ? <Pagination data={totalCount} setPage={setPage} setPerPage={setPerPage} page={page} perPage={perPage} /> : ''}
      </div>
   )
}