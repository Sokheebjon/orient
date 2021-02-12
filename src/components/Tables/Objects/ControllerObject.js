import React, {useContext, useEffect, useState} from 'react';
import {Store} from "../../../Store";
import axios from "../../../API/api";
import style from "./objects.module.css";
import ProductsModal from "../Products/ProductModal";
import pen from "../../../assets/tables/pen.svg";
import TableModal from "../Users/TableModal";
import trash from "../../../assets/tables/delete.svg";
import Table from "../Table";
import {Grid} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import ObjectModal from "./ObjectModal";

const useStyles = makeStyles(theme => ({
   inputRoot: {
      fontSize: 12,
      width: '100%',
      color: '#fff',
      minHeight: 40,
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
   label: {
      color: '#fff',
      fontSize: 13
   },
}));

export default function ObjectController() {
   const classes = useStyles();
   const {state, dispatch} = useContext(Store);
   const [inputs, setInputs] = useState({});
   const [mainData, setMainData] = useState([]);
   const [objecttype, setObjectType] = useState([]);
   const [organizations, setOrganiztions] = useState([]);
   const [totalCount, setTotalCount] = useState();

   useEffect(() => {
      if (inputs.name || inputs.o || inputs.b || inputs.p) {
         axios.get(inputs.name && inputs.o && inputs.b && inputs.p ?
            `/api/v1/objects?builderOrganizationId=${inputs.b}&name=${inputs.name}&objectTypeId=${inputs.o}&payerOrganizationId=${inputs.p}`
            : (inputs.o ? `/api/v1/objects?objectTypeId=${inputs.o}` :
               (inputs.b ? `/api/v1/objects?builderOrganizationId=${inputs.b}` :
                  (inputs.p ? `/api/v1/objects?payerOrganizationId=${inputs.p}` : `/api/v1/objects?name=${inputs.name}`))),
            {headers: {Authorization: `Bearer ${state.token}`}})
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
      } else {
         Promise.all([
            axios.get(`/api/v1/objects?page=${state.page}&perPage=${state.perPage}`, {headers: {Authorization: `Bearer ${state.token}`}}),
            axios.get(`/api/v1/object/types`, {headers: {Authorization: `Bearer ${state.token}`}}),
            axios.get(`/api/v1/organizations`, {headers: {Authorization: `Bearer ${state.token}`}})
         ]).then(function (res) {
            const objects = res[0];
            const objectTypes = res[1];
            const organizations = res[2];
            setMainData(objects.data.data)
            setObjectType(objectTypes.data.data)
            setOrganiztions(organizations.data.data)
            setTotalCount(objects.data.totalCount)
         }).catch((err) => {
            console.log(err)
            if (err.response ? err.response.status === 401 : '') {
               localStorage.removeItem('id_token');
               return dispatch({type: 'SET_TOKEN', payload: ''})
            }
         })
      }
   }, [state.updated, inputs.o, inputs.b, inputs.p, inputs.name, state.page, state.perPage])

   const handleInputChange = (event) => {
      event.persist();
      const name = event.target.name;
      setInputs(inputs => ({...inputs, [name]: event.target.value}));
   }
   const handleInputComplete = (event, newValue, name) => {
      event.persist();
      if (name === 'objectTypeId') {
         setInputs(inputs => ({...inputs, ['o']: newValue ? newValue.id : null}));
      } else if (name === 'builderOrganizationId') {
         setInputs(inputs => ({...inputs, ['b']: newValue ? newValue.id : null}));
      } else if (name === 'payerOrganizationId') {
         setInputs(inputs => ({...inputs, ['p']: newValue ? newValue.id : null}));
      }
   }

   const filter = [
      {
         label: 'Название объекта',
         name: 'name',
         value: 'name',
         textArea: true,
      },
      {
         label: 'Покупатель',
         name: 'builderOrganizationId',
         value: 'builderOrganizationId',
         textArea: false,
         option: organizations,
         optionName: 'builderOrganizationName'
      },
      {
         label: 'Плательщик',
         name: 'payerOrganizationId',
         value: 'payerOrganizationId',
         textArea: false,
         option: organizations,
         optionName: 'payerOrganizationName'
      },
      {
         label: 'Тип объекта',
         name: 'objectTypeId',
         value: 'objectTypeId',
         textArea: false,
         option: objecttype,
         optionName: 'objectTypeName'
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
            Header: 'Покупатель',
            accessor: 'builderOrganizationName',
            sortBy: true
         },
         {
            Header: 'Плательщик',
            accessor: 'payerOrganizationName',
            sortBy: true,
         },
         {
            Header: 'Тип объекта',
            accessor: 'objectTypeName',
         },
         {
            Header: 'Действия',
            accessor: 'action',
            Width: 100,
            Cell: (row) => {
               return <div className={style.TakeAction}>
                  <ObjectModal img={pen} id={row.row.original.id} data={row.row.original} updated={true} map={true}
                               title={'Изменить объект'}
                               updatedUrl={'/api/v1/object/update'} inputForm={filter}
                  />
                  <TableModal img={trash} data={'delete'} title={'Удалить Объект'} deleteId={row.row.original.id}
                              url={'/api/v1/object'}/>
               </div>
            }
         },
      ],
      [filter],
   )

   const data = React.useMemo(
      () => mainData,
      [mainData]
   )

   return (
      <div className={style.main}>
         <div className={style.top}>
            <p>Объекты</p>
            <ObjectModal postUrl={'/api/v1/object/create'} title={'Добавить объект'} inputForm={filter} map={true}
                         updated={false}/>
         </div>
         <Grid container spacing={3}>
            {filter.map((element, i) =>
               <Grid item xs={3} xl={3} className={style.colorAutocomplete}>
                  {element.textArea === true ?
                     <TextField
                        key={i}
                        variant="outlined"
                        size="small"
                        InputProps={{
                           className: classes.multilineColor
                        }}
                        className={classes.inputRoot}
                        name={element.name}
                        type={element.name}
                        value={inputs[element.value] || null}
                        onChange={handleInputChange}
                        label={element.label}
                        InputLabelProps={{
                           className: classes.label
                        }}
                     />
                     :
                     <Autocomplete
                        key={i}
                        classes={classes}
                        style={{marginBottom: 20}}
                        id="combo-box-demo"
                        options={element.option}
                        getOptionLabel={(option) => option.name}
                        onChange={(e, newValue) => handleInputComplete(e, newValue, element.name)}
                        value={inputs[element.value]}
                        type={element.name}
                        renderInput={(params) => <TextField
                           {...params} label={element.label} variant="outlined"
                           InputLabelProps={{className: style.label}}
                           name={element.name}
                           size="small"/>}
                     />
                  }
               </Grid>
            )}
         </Grid>
         <Table data={data} columns={columns} totalCount={totalCount}/>
      </div>
   )
}