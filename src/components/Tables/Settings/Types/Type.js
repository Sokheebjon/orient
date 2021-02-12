import React, {useContext, useEffect, useState} from "react";
import {Store} from "../../../../Store";
import axios from "../../../../API/api";
import Table from "../../Table";
import style from './types.module.css';
import AddType from "./AddType";
import pen from "../../../../assets/tables/pen.svg";
import TableModal from "../../Users/TableModal";
import trash from "../../../../assets/tables/delete.svg";

export default function Types() {
   const [filtered, setFiltered] = useState();
   const [child, setChild] = useState();
   const {state, dispatch} = useContext(Store);
   const [mainData, setMainData] = useState([]);
   const [totalCount, setTotalCount] = useState();

   useEffect(() => {
      axios.get(`/api/v1/types/parents`, {headers: {Authorization: `Bearer ${state.token}`}})
         .then((res) => {
            setMainData(res.data.data)
         })
         .catch((err) => {
            console.log(err)
            if (err.response ? err.response.status === 401 : '') {
               localStorage.removeItem('id_token');
               return dispatch({type: 'SET_TOKEN', payload: ''})
            }
         })
   }, [state.updated])

   useEffect(() => {
      if (filtered) {
         axios.get(`/api/v1/types?typeCode=${filtered}&page=${state.page}&perPage=${state.perPage}`, {headers: {Authorization: `Bearer ${state.token}`}})
            .then((res) => {
               setChild(res.data.data)
               setTotalCount(res.data.totalCount)
            })
            .catch((err) => {
               console.log(err)
               if (err.response ? err.response.status === 401 : '') {
                  localStorage.removeItem('id_token');
                  return dispatch({type: 'SET_TOKEN', payload: ''})
               }
            })
      }
   }, [filtered, state.updated, state.page, state.perPage])

   const childColumn = React.useMemo(
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
            Header: 'Name Uz',
            accessor: "nameUz",
         },
         {
            Header: 'Name Ru',
            accessor: 'nameRu',
         },
         {
            Header: 'Name En',
            accessor: 'nameEn',
         },
         {
            Header: 'Type Code',
            accessor: 'typeCode',
         },
         {
            Header: 'Действия',
            accessor: 'action',
            Cell: (row) => {
               return <div className={style.TakeAction}>
                  <AddType img={pen} data={row.row.original} edit={true}/>
                  <TableModal img={trash} data={'delete'} title={'Удалить child'} deleteId={row.row.values.id}
                              url={'/api/v1/types'}/>
               </div>
            }
         },
      ],
      [],
   )

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
            Header: 'Type',
            accessor: 'value',
         },
         {
            Header: 'Действия',
            accessor: 'action',
            Cell: (row) => {
               return <div className={style.TakeAction}>
                  <AddType img={pen} data={row.row.original} edit={true} editRule={true}/>
                  <TableModal img={trash} data={'delete'} title={'Удалить parent'} deleteId={row.row.values.id}
                              url={'/api/v1/types'}/>
               </div>
            }
         },
      ],
      [],
   )

   const data = React.useMemo(
      () => mainData,
      [mainData]
   )

   const handleClick = (e) => {
      setFiltered(e.original.value)
   }

   return (
      <div className={style.main}>
         <div className={style.top}>
            <p>Parent Type</p>
            <p>Child Type</p>
            <AddType maindata={mainData}/>
         </div>
         <div className={style.tableType}>
            <div className={style.parent}>
               <Table data={data} columns={columns} onClick={(e) => handleClick(e)} totalCount={totalCount}/>
            </div>
            <hr className={style.divider}/>
            {child ?
               <div className={style.child}>
                  <Table data={child} columns={childColumn} totalCount={totalCount}/>
               </div>
               : ''}
         </div>
      </div>
   )
}