import polz from '../../../assets/images/polzovatel.svg';
import org from '../../../assets/images/org.svg';
import zayavki from '../../../assets/images/Zayavki.svg';
import contacts from '../../../assets/images/contacts.svg';
import tender from '../../../assets/images/tender.svg';
import pk from '../../../assets/images/platejniykalendar.svg';
import products from '../../../assets/images/products.svg';
import post from '../../../assets/images/postavshiki.svg';
import objects from '../../../assets/images/obyektiy.svg';
import smeta from '../../../assets/images/smeta.svg';
import sklad from '../../../assets/images/sklad.svg';
import otch from '../../../assets/images/otchet.svg';
import news from '../../../assets/nodes/new.svg';
import received from '../../../assets/nodes/received.svg';
import confirmed from '../../../assets/nodes/confirmed.svg';
import saved from '../../../assets/nodes/saved.svg';
import confirmSZK from '../../../assets/nodes/podSzk.svg';
import payed from '../../../assets/nodes/payed.svg';
import myContracts from '../../../assets/nodes/mycontracts.svg';
import rejected from '../../../assets/nodes/rejected.svg';
import operating from '../../../assets/nodes/operating.svg';
import byContracts from '../../../assets/nodes/byContracts.svg';
import byRequest from '../../../assets/nodes/byRequest.svg'
import nastroyki from '../../../assets/images/nastroyki.svg';
import access from '../../../assets/nodes/access.svg';
import dostup from '../../../assets/nodes/dostup.svg';
import role from '../../../assets/nodes/role.svg';
import type from '../../../assets/nodes/type.svg';


export const SideData = [
   {
      name: {
         uz: "Foydalanuvchilar",
         en: "Users",
         ru: "Пользователи",
      },
      img: polz,
      link: "users",
      active: "/users",
      nodes: []
   },
   {
      name: {
         uz: "Tashkilotlar",
         en: "Organizations",
         ru: "Организации"
      },
      img: org,
      link: "org",
      active: "/org",
      nodes: []
   },
   {
      name: {
         uz: "Arizalar",
         en: "Applications",
         ru: "Заявки"
      },
      img: zayavki,
      link: "application/new",
      active: "/apl",
      nodes: [
         {
            name: {
               uz: "Yangi",
               en: "New",
               ru: "Новая"
            },
            img: news,
            link: "application/new",
            badge: null
         },
         {
            name: {
               uz: "Qabul qilingan",
               en: "Received",
               ru: "Принятые"
            },
            img: received,
            link: "application/receive",
            badge: 18500
         },
         {
            name: {
               uz: "Tasdiqlangan",
               en: "Confirmed",
               ru: "Подтвержденные"
            },
            img: confirmed,
            link: "application/confirmed",
            badge: 854
         },
         {
            name: {
               uz: "Saqlangan",
               en: "Saved",
               ru: "Сохраненные"
            },
            img: saved,
            link: "",
            badge: 8514
         }
      ]
   },
   {
      name: {
         uz: "Kontaktlar",
         en: "Contacts",
         ru: "Контракты"
      },
      img: contacts,
      link: "contracts/accepted",
      active: "",
      nodes: [
         {
            name: {
               uz: "Qabul qilingan",
               en: "Received",
               ru: "Принятые"
            },
            img: received,
            link: "contracts/accepted",
            badge: 1254
         },
         {
            name: {
               uz: "Tasdiqlangan",
               en: "Confirmed",
               ru: "Подтвержденные"
            },
            img: confirmed,
            link: "",
            badge: 18500
         },
         {
            name: {
               uz: "SZK tasdiqlagan",
               en: "Confirmed by CPC",
               ru: "Подтвержденные ЦЗК"
            },
            img: confirmSZK,
            link: "",
            badge: 854
         },
         {
            name: {
               uz: "To'langan",
               en: "Paid",
               ru: "Оплачено"
            },
            img: payed,
            link: "",
            badge: 8514
         },
         {
            name: {
               uz: "Mening kontaktlarim",
               en: "My contacts",
               ru: "Мои контакты"
            },
            img: myContracts,
            link: "",
            badge: 8514
         },
         {
            name: {
               uz: "Rad etilgan",
               en: "Rejected",
               ru: "Отклонено"
            },
            img: rejected,
            link: "",
            badge: 8514
         }
      ]
   },
   {
      name: {
         uz: "Tender",
         en: "Tender",
         ru: "Тендер"
      },
      img: tender,
      link: "#",
      active: "",
      nodes: [
         {
            name: {
               uz: "Tasdiqlangan",
               en: "Confirmed",
               ru: "Подтвержденные"
            },
            img: confirmed,
            link: "",
            badge: 8514

         },
         {
            name: {
               uz: "Amaldagi",
               en: "Confirmed",
               ru: "Действующие"
            },
            img: operating,
            link: "",
            badge: 4525
         }
      ]
   },
   {
      name: {
         uz: "To'lov jadvali",
         en: "Payment schedule",
         ru: "Платежный календарь"
      },
      img: pk,
      link: "",
      active: "",
      nodes: []
   },
   {
      name: {
         uz: "Mahsulotlar",
         en: "products",
         ru: "Продукты"
      },
      img: products,
      link: "products",
      active: "",
      nodes: [
         {
            name: {
               uz: "Tasdiqlangan",
               en: "Confirmed",
               ru: "Продукты"
            },
            img: confirmed,
            link: "products",
            badge: null
         },
         {
            name: {
               uz: "Amaldagi",
               en: "Confirmed",
               ru: "Категория"
            },
            img: operating,
            link: "products/category",
            badge: null
         }
      ]
   },
   {
      name: {
         uz: "Yetkazib beruvchilar",
         en: "Suppliers",
         ru: "Поставщики"
      },
      img: post,
      link: "suppliers",
      active: "",
      nodes: []
   },
   {
      name: {
         uz: "Ob'ektlar",
         en: "Objects",
         ru: "Объекты"
      },
      img: objects,
      link: "objects",
      active: "",
      nodes: [
         {
            name: {
               uz: "Objects",
               en: "Objects",
               ru: "Объекты"
            },
            img: confirmed,
            link: "objects",
            badge: null
         },
         {
            name: {
               uz: "Kategoriya",
               en: "Category",
               ru: "Категория"
            },
            img: operating,
            link: "object/types",
            badge: null
         }
      ]
   },
   {
      name: {
         uz: "Smeta",
         en: "Estimate",
         ru: "Смета"
      },
      img: smeta,
      link: "",
      active: "",
      nodes: []
   },
   {
      name: {
         uz: "Ombor",
         en: "Warehouse",
         ru: "Склад"
      },
      img: sklad,
      link: "",
      active: "",
      nodes: []
   },
   {
      name: {
         uz: "Hisobotlar",
         en: "Reports",
         ru: "Отчеты"
      },
      img: otch,
      link: "",
      active: "",
      nodes: [
         {
            name: {
               uz: "Shartnomalar bo'yicha",
               en: "By contracts",
               ru: "По контрактам"
            },
            img: byContracts,
            link: "",
            badge: null
         },
         {
            name: {
               uz: "Arizalar bo'yicha",
               en: "By Applications",
               ru: "По заявкам"
            },
            img: byRequest,
            link: "",
            badge: null
         },
         {
            name: {
               uz: "Mahsulotlar bo'yicha",
               en: "By Products",
               ru: "По Продуктам"
            },
            img: products,
            link: "",
            badge: null
         }
      ]
   },
   {
      name: {
         uz: "Sozlamalar",
         en: "Settings",
         ru: "Settings"
      },
      img: nastroyki,
      link: "settings/type",
      active: "/settings",
      nodes: [
         {
            name: {
               uz: "Turlari",
               en: "Types",
               ru: "Типы"
            },
            img: type,
            link: "settings/type",
            badge: null
         },
         {
            name: {
               uz: "Rollar",
               en: "Roles",
               ru: "Роли"
            },
            img: role,
            link: "settings/roles",
            badge: null
         },
         {
            name: {
               uz: "Qaror",
               en: "Resolution",
               ru: "Разрешение"
            },
            img: access,
            link: "settings/access",
            badge: null
         },
         {
            name: {
               uz: "Ruxsat",
               en: "Access",
               ru: "Доступ"
            },
            img: dostup,
            link: "settings/resolution",
            badge: null
         }
      ]
   },
];
