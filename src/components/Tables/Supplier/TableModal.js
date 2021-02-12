import React, {useContext, useEffect, useState} from 'react';
import TransitionsModal from "../../UI/Modal/Modal";
import style from "../Supplier/supplier.module.css";
import close from '../../../assets/tables/close.svg';
import logo from '../../../assets/dashboard/logoCardBack.svg';

import {useTranslation} from "react-i18next";
import axios from "../../../API/api";
import {Store} from "../../../Store";
import Table from "../Table";
import time from "../../../assets/tables/time.svg";
import AddOrg from "../Organizations/AddOrg";

export default function TableModal(props) {
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);
    const {state, dispatch} = useContext(Store);
    const [mainData, setMainData] = useState(props.detailsItemInfo.supplierProductPrices);

    const handleOpen = () => {
        setOpen(true);
    }

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
                Header: t('productModel'),
                accessor: 'productModel',
            },
            {
                Header: t('productType'),
                accessor: 'productType',
            },
            {
                Header: t('price'),
                accessor: 'price',
            },
            {
                Header: t('boughtDate'),
                accessor: 'boughtDate',
            },
            {
                Header: t('unitTypeName'),
                accessor: 'unitTypeName',
            },
            {
                Header: t('currencyTypeName'),
                accessor: 'currencyTypeName',
            }
        ],
        [t]
    );

    const data = React.useMemo(
        () => mainData,
        [t, mainData]
    );



    console.log("mainData");
    console.log(mainData);

    return (
        <div>
            <img src={props.img} alt="" onClick={handleOpen}/>
            <TransitionsModal open={open} handleClose={handleClose}>
                <div className={style.tableModal}>
                    <img src={logo} alt="" className={style.logo}/>
                    <h3>{props.title}</h3>
                    <img src={close} alt="" className={style.close} onClick={handleClose}/>
                    <Table data={data} columns={columns}/>
                    <div className={style.modalContacts}>
                        {props.actions ? props.actions.map(e =>
                            <img src={e.img} alt=""/>
                        ) : ''}
                    </div>
                </div>
            </TransitionsModal>
        </div>
    )
}