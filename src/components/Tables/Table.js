import React, {useState} from 'react';
import {useTable, useSortBy, useExpanded} from 'react-table';
import style from './table.module.css';
import sort from '../../assets/tables/sort.svg';
import Pagination from "./Pagination/Pagination";
import MoreDetail from "./Applications/RecieveApplications/MoreDetail";

export default function Table(props) {
   const [page, setPage] = React.useState(1);
   const [perPage, setPerPage] = useState(10);

   const renderRowSubComponent = React.useCallback(
      ({row}) => (
         <MoreDetail row={row.original}/>
      ),
      []
   )

   const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      visibleColumns,
   } = useTable({columns: props.columns, data: props.data}, useSortBy, useExpanded)

   return (
      <div>
         <div className={style.main}>
            <table {...getTableProps()} className={style.table}>
               {props.header !== false ?
                  <thead className={style.thead}>
                  {headerGroups.map(headerGroup => (
                     <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                           <th {...column.getHeaderProps(column.sortBy === true ? column.getSortByToggleProps() : '')}
                               className={style.th}
                               width={column.Width}>
                              {column.render('Header')}
                              <span>
                                {column.isSorted
                                && column.isSortedDesc || column.sortBy === true
                                   ? <img src={sort} alt="" className={style.sort}/>
                                   : ''}
                              </span>
                           </th>
                        ))}
                     </tr>
                  ))}
                  </thead>
                  : ''}
               <tbody {...getTableBodyProps()} className={style.tbody}>
               {rows.map((row, i) => {
                  prepareRow(row)
                  return (
                     <React.Fragment key={i}>
                        <tr onClick={props.onClick ? () => props.onClick(row) : null} {...row.getRowProps()}
                            className={style.tr} tabIndex="0">
                           {row.cells.map(cell => {
                              return (
                                 <td {...cell.getCellProps()} className={style.td}>
                                    {cell.render('Cell')}
                                 </td>
                              )
                           })}
                        </tr>
                        {row.isExpanded ? (
                           <tr>
                              <td colSpan={visibleColumns.length}>
                                 {renderRowSubComponent({row})}
                              </td>
                           </tr>
                        ) : null}
                     </React.Fragment>
                  )
               })}
               </tbody>
            </table>
         </div>
         {props.data.length !== 0 && props.totalCount ?
            <Pagination data={props.totalCount} setPage={setPage} setPerPage={setPerPage} page={page}
                        perPage={perPage}/> : ''}
      </div>
   )
}