import React, {useContext, useEffect, useState} from 'react';
import {Store} from "../../../Store";
import axios from "../../../API/api";
import style from "./objects.module.css";
import Table from "../Table";
import ObjectModal from "./ObjectModal";
import pen from "../../../assets/tables/pen.svg";
import TableModal from "../Users/TableModal";
import trash from "../../../assets/tables/delete.svg";
import eye from '../../../assets/tables/eye.svg';

export default function ObjectTypeController() {
   const {state, dispatch} = useContext(Store)
   const [mainData, setMainData] = useState([]);

   useEffect(() => {
      axios.get(`/api/v1/object/types`, {headers: {Authorization: `Bearer ${state.token}`}})
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

   const filter = [
      {
         label: 'Название категории',
         name: 'name',
         value: 'name',
         textArea: true,
      },
   ]

   const columns = React.useMemo(
      () => [
         {
            Header: '№',
            accessor: "id",
            Width: 10,
            Cell: ({row}) => {
               return row.index + 1
            }
         },
         {
            Header: 'Название объекта',
            accessor: 'name',
            sortBy: true,
         },
         {
            Header: 'Действия',
            accessor: 'action',
            Width: 100,
            Cell: (row) => {
               return <div className={style.TakeAction}>
                  <ObjectModal img={eye} title={'Типы'} eye={true} eyeData={row.row.original.objectTypeProperties}/>
                  <ObjectModal img={pen} data={row.row.original} updated={true} objectType={true}
                               updatedUrl={'/api/v1/object/type/update'} inputForm={filter}/>
                  <TableModal img={trash} data={'delete'} title={'Удалить Объект'} deleteId={row.row.original.id}
                              url={'/api/v1/object/type'}/>
               </div>
            }
         },
      ],
      [filter, mainData],
   )

   const data = React.useMemo(
      () => mainData,
      [mainData]
   )

   return (
      <div className={style.main}>
         <div className={style.top}>
            <p>Объект типы</p>
            <ObjectModal postUrl={'/api/v1/object/type/create'} title={'Добавить категорий'} inputForm={filter}
                         objectType={true} map={false}/>
         </div>
         <Table data={data} columns={columns}/>
      </div>
   )
}