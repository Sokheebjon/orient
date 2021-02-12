import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import ru from '../Translation/ru.json';
import en from '../Translation/en.json'
import uz from '../Translation/uz.json';

i18n
   .use(initReactI18next) // passes i18n down to react-i18next
   .init({
      resources: {
         ru: {
            translation: ru
         },
         en: {
            translation: en
         },
         uz: {
            translation: uz
         }
      },
      lng: localStorage.getItem('lang') ? localStorage.getItem('lang') : 'ru',

      keySeparator: false, // we do not use keys in form messages.welcome

      interpolation: {
         escapeValue: false // react already safes from xss
      }
   });

export default i18n;