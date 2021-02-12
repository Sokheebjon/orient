import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import React, {useContext, useEffect, useState} from "react";
import {Store} from "../../../Store";
import Button from "../../UI/Button/Button";
import TransitionsModal from "../../UI/Modal/Modal";
import style from "../Supplier/supplier.module.css";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField/TextField";
import Table from "../Table";
import axios from "../../../API/api";
import time from "../../../assets/tables/time.svg";
import TableModal from "../Supplier/TableModal";
import eye from "../../../assets/tables/eye.svg";
import close from "../../../assets/tables/close.svg";


const useStyles = makeStyles(theme => ({
    inputRoot: {
        fontSize: 12,
        width: "100%",
        color: '#fff',
        fontFamily: "Montserrat",
        "& .MuiOutlinedInput-notchedOutline": {
            borderWidth: "1px",
            borderColor: "#fff",
        }
    },
    input: {
        color: '#fff',
        fontSize: 13
    }
}));

export default function DetailsSupplier(props) {
    const {t} = useTranslation();
    const classes = useStyles();
    const {state, dispatch} = useContext(Store);
    const [open, setOpen] = useState(false);
    const [mainData, setMainData] = useState([]);
    const [inputs, setInputs] = useState( props.detailsInfo );


    useEffect(() => {
            Promise.all([
                axios.get(`/api/v1/supplier/update/dto?selfId=${props.detailsInfo.id}`, {headers: {Authorization: `Bearer ${state.token}`}}),
                // axios.get(`/api/v1/supplier/${props.detailsInfo.id}`, {headers: {Authorization: `Bearer ${state.token}`}})
            ]).then(function (res) {
                const suppliers = res[0];
                setMainData(suppliers.data.data.supplierProducts)
            }).catch((err) => {
                console.log(err)
                if (err.response ? err.response.status === 401 : '') {
                    localStorage.removeItem('id_token');
                    return dispatch({type: 'SET_TOKEN', payload: ''})
                }
            })
    }, []);


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
                Header: t('productName'),
                accessor: 'productName',
            },
            {
                Header: t('categoryName'),
                accessor: 'categoryName',
            },
            {
                Header: t('history'),
                Cell: (row) => {
                    return <div className={style.action}>
                        <TableModal img={time} title={t('historyActions')} detailsItemInfo={row.row.original} />
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

    const form = [
        {
            label: t('organizationName'),
            variant: 'outlined',
            name: 'organizationName',
            value: 'organizationName',
            textArea: true,
            nested: false,
            disabled: true
        },
        {
            label: t('supplierPosition'),
            variant: 'outlined',
            name: 'supplierPosition',
            value: 'supplierPosition',
            textArea: true,
            nested: false,
            disabled: true
        },
        {
            label: t('supplierInn'),
            variant: 'outlined',
            name: 'supplierInn',
            value: 'supplierInn',
            textArea: true,
            nested: false,
            disabled: true
        },
        {
            label: t('supplierName'),
            variant: 'outlined',
            name: 'supplierName',
            value: 'supplierName',
            textArea: true,
            nested: false,
            disabled: true
        },
        {
            label: t('email'),
            variant: 'outlined',
            name: 'email',
            value: 'email',
            textArea: true,
            nested: false,
            disabled: true
        },
        {
            label: t('phoneNumber'),
            variant: 'outlined',
            name: 'phoneNumber',
            value: 'phoneNumber',
            textArea: true,
            nested: false,
            disabled: true
        },
    ];

    return (
        <div>
            {props.img ? <img src={props.img} alt="" onClick={handleOpen}/> :
                <Button btnType="addUser" clicked={handleOpen}>{t('add')}</Button>}
            <TransitionsModal open={open} handleClose={handleClose}>
                <div className={style.modal}>
                    {/*<img src={logo} alt="" className={style.backLogo}/>*/}
                    <h3>{t('addSupplier')}</h3>
                    <img src={close} alt="" className={style.close} onClick={handleClose}/>
                    <Grid className={style.form} container spacing={3}>
                        {form.map((element, i) =>
                            <Grid item xs={3} xl={3}>
                                <TextField
                                    key={i}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        className: style.input
                                    }}
                                    className={classes.inputRoot}
                                    name={element.name}
                                    type={element.name}
                                    nested={element.nested}
                                    value={inputs[element.value] || null}
                                    label={element.label}
                                    InputLabelProps={{
                                        className: style.label
                                    }}
                                    disabled={element.disabled}
                                />
                            </Grid>
                        )}
                    </Grid>
                    <hr className={style.hr}/>
                    <p>{t('productDetails')}</p>
                    <Table data={data} columns={columns}/>
                </div>
            </TransitionsModal>
        </div>
    )


}