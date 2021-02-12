import React, {useContext} from 'react';
import style from './pagination.module.css';
import Pagination from '@material-ui/lab/Pagination';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {Store} from "../../../Store";

export default function PaginationBelow(props) {
   const {state, dispatch} = useContext(Store);

   const handleChange = (event) => {
      props.setPerPage(event.target.value);
      return dispatch({type: 'PAGE', payload: 0}), dispatch({type: 'PER_PAGE', payload: event.target.value})
   };
   const handlePage = (event, val) => {
      props.setPage(val - 1)
      return dispatch({type: 'PAGE', payload: val - 1})
   };

   return (
      <div className={style.pagination}>
         <Pagination
            count={Math.ceil(props.data / state.perPage)}
            defaultPage={state.page + 1}
            variant="outlined"
            size="medium"
            color="primary"
            shape="rounded"
            className={style.root}
            onChange={(e, val) => handlePage(e, val)}
         />
         <FormControl className={style.formControl}>
            <Select
               labelId="demo-simple-select-label"
               id="demo-simple-select"
               value={state.perPage}
               onChange={handleChange}
            >
               <MenuItem value={20}>20</MenuItem>
               <MenuItem value={50}>50</MenuItem>
               <MenuItem value={75}>75</MenuItem>
               <MenuItem value={100}>100</MenuItem>
            </Select>
         </FormControl>
      </div>
   )
}