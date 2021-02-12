import React, {useContext, useEffect, useState} from 'react';
import Table from "../Table";
import {useTranslation} from "react-i18next";
import style from './supplier.module.css';
import {Store} from "../../../Store";
import AddSupplier from "./AddSupplier";
import TableModal from "../Organizations/TableModal";
import time from "../../../assets/tables/time.svg";
import pen from "../../../assets/tables/pen.svg";
import eye from "../../../assets/tables/eye.svg";
import {Grid} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import axios from "../../../API/api";
import AddOrg from "../Organizations/AddOrg";
import DetailsSupplier from "./DetailsSupplier";


const useStyles = makeStyles(theme => ({
    inputRoot: {
        fontSize: 12,
        width: "100%",
        color: '#fff',
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

export default function Supplier() {
    const classes = useStyles();
    const {t} = useTranslation();
    const {state, dispatch} = useContext(Store);
    const [mainData, setMainData] = useState([]);
    const [inputs, setInputs] = useState({});


    useEffect(() => {
        if (inputs.supplierInn || inputs.organizationName || inputs.product ) {
            axios.get(inputs.name && inputs.organizationName && inputs.product ?
                `/api/v1/suppliers?supplierInn=${inputs.supplierInn}&organizationName=${inputs.organizationName}&product=${inputs.product}`
                :(inputs.supplierInn ? `/api/v1/suppliers?supplierInn=${inputs.supplierInn}`:
                    (inputs.organizationName ? `/api/v1/suppliers?organizationName=${inputs.organizationName}` :
                    `/api/v1/suppliers?product=${inputs.product}`)),
                {headers: {Authorization: `Bearer ${state.token}`}})
                .then((res) => {
                    console.log(res.data.data);
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
                axios.get(`/api/v1/suppliers?`, {headers: {Authorization: `Bearer ${state.token}`}})
            ]).then(function (res) {
                const suppliers = res[0];
                setMainData(suppliers.data.data)
            }).catch((err) => {
                console.log(err)
                if (err.response ? err.response.status === 401 : '') {
                    localStorage.removeItem('id_token');
                    return dispatch({type: 'SET_TOKEN', payload: ''})
                }
            })
        }
    }, [state.updated, inputs.supplierInn, inputs.organizationName, inputs.product]);

    const handleInputChange = (event) => {
        event.persist();
        setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
    };

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
                Header: t('INN'),
                accessor: 'supplierInn',
            },
            {
                Header: t('Organization'),
                accessor: 'organizationName',
            },
            {
                Header: t('F.I.SH'),
                accessor: "supplierName",
            },
            {
                Header: t('Position'),
                accessor: 'supplierPosition',
            },
            {
                Header: t('phoneNumber'),
                accessor: 'phoneNumber',
            },
            {
                Header: t('email'),
                accessor: 'email',
            },
            {
                Header: t('action'),
                Cell: (row) => {
                    return <div className={style.action}>
                        <DetailsSupplier img={eye}  detailsInfo={row.row.original} />
                        <AddSupplier img={pen} updateInfo={row.row.original} isTrusted={true} updated={true}
                                     updatedUrl={'/api/v1/supplier/update'}/>
                    </div>
                }
            },
        ],
        [t]
    );

    const data = React.useMemo(
        () => mainData,
        [t, mainData]
    );

    const filter = [
        {
            label: t('INN'),
            name: 'supplierInn',
            value: 'supplierInn',
            textArea: true
        },
        {
            label: t('org'),
            name: 'organizationName',
            value: 'organization',
            textArea: true
        },
        {
            label: t('product'),
            name: 'product',
            value: 'product',
            textArea: true
        }
    ];

    return (
        <div className={style.main}>
            <div className={style.top}>
                <p>{t('supplier')}</p>
                <AddSupplier updated={false}/>
            </div>
            <Grid container spacing={3} className={style.colorAutocomplete}>
                {filter.map((element, i) =>
                    <Grid item xs={3} xl={3} key={i}>
                        <TextField
                            key={i}
                            variant="outlined"
                            size="small"
                            style={{marginBottom: 15}}
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
                                className: style.label
                            }}
                        />
                    </Grid>
                )}
            </Grid>
            <Table data={data} columns={columns}/>
        </div>
    )
}