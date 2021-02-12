import React, {useContext, useEffect, useState} from 'react';
import style from './products.module.css'
import {Store} from "../../../Store";
import axios from "../../../API/api";
import pen from "../../../assets/tables/pen.svg";
import TableModal from "../Users/TableModal";
import trash from "../../../assets/tables/delete.svg";
import Table from "../Table";
import ProductsModal from "./ProductModal";

export default function Products() {
   const {state, dispatch} = useContext(Store);
   const [mainData, setMainData] = useState([]);

   useEffect(() => {
      axios.get(`/api/v1/product/categories`, {headers: {Authorization: `Bearer ${state.token}`}})
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
            Header: 'Название продукта',
            accessor: 'name',
            sortBy: true,
         },
         {
            Header: 'Действия',
            accessor: 'action',
            Width: 150,
            Cell: (row) => {
               return <div className={style.TakeAction}>
                  <ProductsModal img={pen} data={row.row.original} updated={true}
                                 updatedUrl={'/api/v1/product/categories/update'} id={row.row.original.id}/>
                  <TableModal img={trash} data={'delete'} title={'Удалить категорий'} deleteId={row.row.original.id}
                              url={'/api/v1/product/categories'}/>
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

   return (
      <div className={style.main}>
         <div className={style.top}>
            <p>Категория</p>
            <ProductsModal postUrl={'/api/v1/product/categories/create'} category={true} title={'Добавить категорий'}/>
         </div>
         <Table data={data} columns={columns}/>
      </div>
   )
}