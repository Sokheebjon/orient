import React, {useContext, useEffect, useState} from "react";
import Button from "../../UI/Button/Button";
import TransitionsModal from "../../UI/Modal/Modal";
import {useTranslation} from "react-i18next";
import {Store} from "../../../Store";
import axios from "../../../API/api";
import style from "../Users/users.module.css";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import logo from '../../../assets/dashboard/logoCardBack.svg';

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
    input: {
        color: '#fff',
        fontSize: 13
    }
}));

export default function AddSupplier(props) {
    const {t} = useTranslation();
    const classes = useStyles();
    const {state, dispatch} = useContext(Store);
    const [open, setOpen] = useState(false);
    const [isTrue, setIsTrue] = useState(props.isTrusted === true ? props.isTrusted : false);
    const [supplierProduct, setSupplierProduct] = useState([{
        productId: '',
        boughtDate: '',
        productType: '',
        productModel: '',
        unitTypeId: '',
        currencyTypeId: '',
        price: ''
    }]);
    const [product, setProduct] = useState([{product: ''}]);
    const [unitType, setUnitType] = useState([{unitType: ''}]);
    const [currencyType, setCurrencyType] = useState([{currencyType: ''}]);
    const [inputs, setInputs] = useState(props.updated === true ? props.updateInfo : {
        organizationName: '', supplierName: '', supplierInn: '', supplierPosition: '', phoneNumber: '', email: ''
    });
    useEffect(() => {
        if (props.updated === true) {
            Promise.all([
                axios.get(`/api/v1/supplier/update/dto?selfId=${props.updateInfo.id}`, {headers: {Authorization: `Bearer ${state.token}`}})
            ]).then(function (results) {
                const supplierUpdate = results[0];
                setSupplierProduct(supplierUpdate.data.data.supplierProducts);
            }).catch((err) => {
                console.log(err);
                if (err.response ? err.response.status === 401 : '') {
                    localStorage.removeItem('id_token');
                    return dispatch({type: 'SET_TOKEN', payload: ''})
                }
            })
        }
        setInputs(inputs)
    }, [inputs]);

    useEffect(() => {
        Promise.all([
            axios.get(`/api/v1/products`, {headers: {Authorization: `Bearer ${state.token}`}}),
            axios.get(`/api/v1/types?typeCode=UNIT_TYPE`, {headers: {Authorization: `Bearer ${state.token}`}}),
            axios.get(`/api/v1/types?typeCode=CURRENCY_TYPE`, {headers: {Authorization: `Bearer ${state.token}`}})
        ]).then(function (results) {
            const productRes = results[0];
            const unitTypeRes = results[1];
            const currencyTypeRes = results[2];
            setProduct(productRes.data.data);
            setUnitType(unitTypeRes.data.data);
            setCurrencyType(currencyTypeRes.data.data);
        }).catch((err) => {
            console.log(err);
            if (err.response ? err.response.status === 401 : '') {
                localStorage.removeItem('id_token');
                return dispatch({type: 'SET_TOKEN', payload: ''})
            }
        })
    }, [state.updated]);

    const handleInputChange = (event, i, state) => {
        event.persist();
        const {name, value} = event.target;
        if (state === 'product') {
            const list = [...supplierProduct];
            list[i][name] = value;
            setSupplierProduct(list);
        } else {
            setInputs(inputs => ({...inputs, [name]: event.target.value}));
        }
    };

    const handleInputChange2 = (event) => {
        event.persist();
        const {name, value} = event.target;
        setInputs(inputs => ({...inputs, [name]: value}));
    };

    const handleInputComplete = (event, i, name, newValue, state) => {
        event.persist();
        if (state === 'product') {
            const list = [...supplierProduct];
            list[i][name] = newValue ? newValue.id : '';
            setSupplierProduct(list);
        } else {
            setInputs(inputs => ({...inputs, [`${name}`]: newValue ? newValue.id : ''}));
        }
    };


    function handleAddSupplierProduct() {
        setSupplierProduct([...supplierProduct, {
            productId: 0,
            boughtDate: '',
            productType: '',
            productModel: '',
            unitTypeId: 0,
            currencyTypeId: 0,
            price: 0
        }]);
    }

    function handleRemoveSupplierProduct(i) {
        const list = [...supplierProduct];
        list.splice(i, 1);
        setSupplierProduct(list);
    }

    function handleSearchByInn() {
        axios.get(`/api/v1/supplier/by/inn?supplierInn=${inputs.supplierInn}`, {headers: {Authorization: `Bearer ${state.token}`}})
            .then((res) => {
                if (res.data.data) {
                    setInputs(res.data.data);
                    setIsTrue(true);
                } else {
                    setIsTrue(true);
                }
            })
            .catch((err) => {
                console.log(err)
                if (err.response ? err.response.status === 401 : '') {
                    localStorage.removeItem('id_token');
                    return dispatch({type: 'SET_TOKEN', payload: ''})
                }
            })

    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmitSingle = (e) => {
        e.preventDefault();
        let data = {
            "organizationName": inputs.organizationName,
            "supplierInn": inputs.supplierInn,
            "supplierName": inputs.supplierName,
            "supplierPosition": inputs.supplierPosition,
            "phoneNumber": inputs.phoneNumber,
            "email": inputs.email,
            "supplierProducts": supplierProduct
        };
        let update = {
            "organizationName": inputs.organizationName,
            "supplierInn": inputs.supplierInn,
            "supplierName": inputs.supplierName,
            "supplierPosition": inputs.supplierPosition,
            "phoneNumber": inputs.phoneNumber,
            "email": inputs.email,
            "supplierProducts": supplierProduct,
            "id": props.updated === true ? props.updateInfo.id : ''
        };
        axios[props.updated === true ? 'put' : 'post'](props.updated === true ? props.updatedUrl : `/api/v1/supplier/create`,
            props.updated === true ? update : data, {headers: {Authorization: `Bearer ${state.token}`}})
            .then(response => {
                if (response.status === 201 || 200) {
                    handleClose();
                    return dispatch({type: 'UPDATED', payload: Math.random()})
                }
            })
            .catch(function (error) {
                console.log(error.response)
            })
    };


    const form = [
        {
            label: t('organizationName'),
            variant: 'outlined',
            name: 'organizationName',
            value: 'organizationName',
            textArea: true,
            nested: false
        },
        {
            label: t('supplierPosition'),
            variant: 'outlined',
            name: 'supplierPosition',
            value: 'supplierPosition',
            textArea: true,
            nested: false
        },
        {
            label: t('supplierName'),
            variant: 'outlined',
            name: 'supplierName',
            value: 'supplierName',
            textArea: true,
            nested: false,
        },
        {
            label: t('email'),
            variant: 'outlined',
            name: 'email',
            value: 'email',
            textArea: true,
            nested: false,
        },
        {
            label: t('phoneNumber'),
            variant: 'outlined',
            name: 'phoneNumber',
            value: 'phoneNumber',
            textArea: true,
            nested: false,
        },
    ];

    const formProducts = [
        {
            label: t('productName'),
            variant: 'outlined',
            name: 'productId',
            value: 'productId',
            textArea: false,
            nested: false,
            option: product,
            optionName: 'name',
            required: true
        },
        {
            label: t('boughtDate'),
            variant: 'outlined',
            name: 'boughtDate',
            value: 'boughtDate',
            type: 'date',
            textArea: true,
            nested: false,
            required: true
        },
        {
            label: t('productType'),
            variant: 'outlined',
            name: 'productType',
            value: 'productType',
            textArea: true,
            nested: false,
            required: true
        },
        {
            label: t('productModel'),
            variant: 'outlined',
            name: 'productModel',
            value: 'productModel',
            textArea: true,
            nested: false,
            required: true
        },
        {
            label: t('unitType'),
            variant: 'outlined',
            name: 'unitTypeId',
            value: 'unitTypeId',
            textArea: false,
            nested: false,
            option: unitType,
            optionName: 'name',
            required: true
        },
        {
            label: t('currencyType'),
            variant: 'outlined',
            name: 'currencyTypeId',
            value: 'currencyTypeId',
            textArea: false,
            nested: false,
            option: currencyType,
            optionName: 'name',
            required: true
        },
        {
            label: t('price'),
            variant: 'outlined',
            name: 'price',
            value: 'price',
            textArea: true,
            nested: false,
            required: true
        },
    ];

    return (
        <div>
            {props.img ? <img src={props.img} alt="" onClick={handleOpen}/> :
                <Button btnType="addUser" clicked={handleOpen}>{t('add')}</Button>}
            <TransitionsModal open={open} handleClose={handleClose}>
                <div className={style.modal}>
                    {/*<img src={logo} alt="" className={style.backLogo}/>*/}
                    <p>{t('addSupplier')}</p>
                    <Grid className={style.form} container spacing={3}>
                        <Grid item xs={3} xl={3}>
                            <TextField
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    className: classes.multilineColor
                                }}
                                className={classes.inputRoot}
                                name="supplierInn"
                                type='supplierInn'
                                value={inputs['supplierInn'] || null}
                                onChange={(e) => handleInputChange2(e)}
                                label='supplierInn'
                                InputLabelProps={{
                                    className: style.label
                                }}
                            />
                        </Grid>
                        <Grid item xs={3} xl={3}>
                            <Button btnType="save" clicked={() => handleSearchByInn()}>{t('search')}</Button>
                        </Grid>
                    </Grid>
                    <hr className={style.hr}/>
                    <Grid className={style.form} container spacing={3}>
                        {isTrue === true ? form.map((element, i) =>
                            <Grid item xs={3} xl={3}>
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
                                    nested={element.nested}
                                    value={inputs[element.value] || null}
                                    onChange={(e) => handleInputChange2(e)}
                                    label={element.label}
                                    InputLabelProps={{
                                        className: style.label
                                    }}
                                    disabled={element.disabled}
                                />
                            </Grid>
                        ) : ''}
                    </Grid>
                    {isTrue === true ? <hr className={style.hr}/> : ''}
                    <p>{t('productDetails')}</p>
                    {supplierProduct.map((field, idx) =>
                        <Grid className={style.form} container spacing={3}>
                            {formProducts.map((element, j) =>
                                <Grid item
                                      xs={(element.name === 'unitTypeId' || element.name === 'currencyTypeId' || element.name === 'price') ? 1 : 2}
                                      xl={(element.name === 'unitTypeId' || element.name === 'currencyTypeId' || element.name === 'price') ? 1 : 2}
                                      key={j}>
                                    {element.textArea === true ?
                                        <TextField
                                            key={idx}
                                            variant="outlined"
                                            size="small"
                                            InputProps={{
                                                className: classes.multilineColor
                                            }}
                                            className={classes.inputRoot}
                                            name={element.name}
                                            type={element.type}
                                            required={element.required}
                                            value={props.updated === true ? field[element.name] : inputs[element.value]}
                                            onChange={(e) => handleInputChange(e, idx, 'product')}
                                            label={element.label}
                                            InputLabelProps={{
                                                className: style.label
                                            }}
                                        /> :
                                        <Autocomplete
                                            key={idx}
                                            classes={classes}
                                            style={{width: '100%', marginRight: 27}}
                                            id="combo-box-demo"
                                            options={element.option}
                                            required={element.required}
                                            defaultValue={props.updated ? element.option.find(v => v.id === field[element.name]) : ''}
                                            getOptionLabel={(option) => option.name}
                                            onChange={(e, newValue) => handleInputComplete(e, idx, element.name, newValue, 'product')}
                                            renderInput={(params) => <TextField
                                                {...params} label={element.label} variant="outlined"
                                                InputLabelProps={{className: style.label}}
                                                name={element.name}
                                                size="small"/>}
                                        />
                                    }
                                </Grid>
                            )}
                            <Grid item xs={1} xl={1}>
                                {idx + 1 !== supplierProduct.length && supplierProduct.length > 1 ?
                                    <Button btnType="remove" style={{marginTop: 5}}
                                            clicked={() => handleRemoveSupplierProduct(idx)}>-</Button> : ''}
                                {idx + 1 === supplierProduct.length ?
                                    <Button btnType="add" style={{marginTop: 5}}
                                            clicked={() => handleAddSupplierProduct()}>+</Button> : ''}
                            </Grid>
                        </Grid>
                    )}
                    <div className={style.action}>
                        <Button btnType="cancel" clicked={handleClose}>{t('cancel')}</Button>
                        <Button btnType="save" clicked={handleSubmitSingle}>{t('save')}</Button>
                    </div>
                </div>
            </TransitionsModal>
        </div>
    )
}