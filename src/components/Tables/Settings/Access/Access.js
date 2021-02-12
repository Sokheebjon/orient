import React, {useContext, useEffect, useState} from 'react';
import style from "./access.module.css";
import Table from "../../Table";
import TableModal from "../../Users/TableModal";
import pen from "../../../../assets/tables/pen.svg";
import trash from "../../../../assets/tables/delete.svg";
import AddAccess from "./AccessModal";
import axios from "../../../../API/api";
import {Store} from "../../../../Store";

export default function Role() {
   const {state, dispatch} = useContext(Store);
   const [mainData, setMainData] = useState([]);

   useEffect(() => {
      axios.get(`/api/v1/permissions`, {headers: {Authorization: `Bearer ${state.token}`}})
         .then((res) => {
            setMainData(res.data.data)
         })
         .catch((err) => {
            console.log(err)
            if(err.response ? err.response.status === 401: ''){
               localStorage.removeItem('id_token');
               return dispatch({type: 'SET_TOKEN', payload: ''})
            }
         })
   }, [state.updated])

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
            Header: 'Code',
            accessor: 'code',
            sortBy: true
         },
         {
            Header: 'Name',
            accessor: 'name',
            sortBy: true
         },
         {
            Header: 'Name Uz',
            accessor: "nameUz",
            sortBy: true
         },
         {
            Header: 'Name Ru',
            accessor: 'nameRu',
            sortBy: true
         },
         {
            Header: 'Name En',
            accessor: 'nameEn',
            sortBy: true
         },
         {
            Header: 'Created Date',
            accessor: 'createdDate',
            sortBy: true
         },
         {
            Header: 'Действия',
            accessor: 'action',
            Width: 100,
            Cell: (row) => {
               return <div className={style.TakeAction}>
                  <AddAccess img={pen} data={row.row.original}/>
                  <TableModal img={trash} data={'delete'} title={'Удалить разрешение'} url={'/api/v1/permissions'}
                              deleteId={row.row.values.id}/>
               </div>
            }
         },
      ],
      [mainData],
   )

   const data = React.useMemo(
      () => mainData,
      [mainData]
   )

   return (
      <div className={style.main}>
         <div className={style.top}>
            <p>Разрешение</p>
            <AddAccess/>
         </div>
         <Table data={data} columns={columns}/>
      </div>
   )
}