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
   const [totalCount, setTotalCount] = useState();

   useEffect(() => {
      axios.get(`/api/v1/products?page=${state.page}&perPage=${state.perPage}&sortBy=name&sortDirection=asc`, {headers: {Authorization: `Bearer ${state.token}`}})
         .then((res) => {
            setMainData(res.data.data)
            setTotalCount(res.data.totalCount)
         })
         .catch((err) => {
            console.log(err)
            if (err.response ? err.response.status === 401 : '') {
               localStorage.removeItem('id_token');
               return dispatch({type: 'SET_TOKEN', payload: ''})
            }
         })
   }, [state.updated, state.page, state.perPage])

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
            Width: 350
         },
         {
            Header: 'Категория',
            accessor: 'productCategoryName',
            sortBy: true
         },
         {
            Header: 'Действия',
            accessor: 'action',
            Width: 100,
            Cell: (row) => {
               return <div className={style.TakeAction}>
                  <ProductsModal img={pen} data={row.row.original} updated={true}
                                 updatedUrl={'/api/v1/product/update'}/>
                  <TableModal img={trash} data={'delete'} title={'Удалить Продукт'} deleteId={row.row.original.id}
                              url={'/api/v1/product'}/>
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
            <p>Продукты</p>
            <ProductsModal postUrl={'/api/v1/product/create'} title={'Добавить продукт'}/>
         </div>
         <Table data={data} columns={columns} totalCount={totalCount}/>
      </div>
   )
}