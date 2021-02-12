import React, {useEffect, useRef, useState} from "react";
import {YMaps, Map, GeolocationControl, Placemark, ZoomControl, SearchControl, TypeSelector} from "react-yandex-maps";
import locIcon from '../../../assets/locIcon.svg';
import style from './map.module.css';

export default function YandexMap(props) {
   const addr = JSON.parse(localStorage.getItem('userData'))
   const [location, setLocation] = useState(addr ? addr[0].location : '');
   const [coors, setCoors] = useState(addr ? addr[0].coordinates : '');

   const ref = useRef();

   const userData = [
      {
         location: location,
         coordinates: coors
      }
   ];

   useEffect(() => {
      props.setData(userData)
   }, [userData[0].coordinates])

   useEffect(() => {
      return onPlacemark();
   }, [coors])

   const dragEvent = (event) => {
      setCoors(event.get('target').geometry.getCoordinates())
   }

   function onPlacemark(event) {
      if (ref.current !== undefined) {
         ref.current.geolocation.get({
            provider: 'browser',
            autoReverseGeocode: true,
            useMapMargin: true
         }).then(function (result) {
            ref.current.geocode(coors).then(function (res) {
               let data = res.geoObjects.get(0).properties.getAll();
               setLocation(data.text)
            });
         });
      }
   }

   const getGeoLocation = (ymaps) => {
      ref.current = ymaps
   };
   const geoControl = {
      options: {
         noPlacemark: false,
         float: 'right',
      },
      parameters: {
         adjustMargin: true
      }
   };
   const placeMark = {
      geometry: {
         type: "Point",
         coordinates: coors
      },
      options: {
         draggable: true,
         iconLayout: 'default#image',
         iconImageHref: locIcon,
         iconImageSize: [40, 40],
         useMapMarginInDragging: true,
         cursor: 'pointer',
         openBalloonOnClick: true,
      }
   };
   const searchControl = {
      options: {
         size: 'medium',
         float: 'right'
      }
   }

   function handleClick(map) {
      if (map) {
         map.events.add('locationchange', function (event) {
            let position = event.get('geoObjects').get(0).properties.getAll();
            let coordinates = event.get('position')
            setLocation(position.text);
            setCoors(coordinates);
         });
      }
   }

   return (
      <div>
         <YMaps query={{apikey: 'a611d201-19b9-4184-98c3-e7d6c4de6c1d'}}>
            <Map
               defaultState={{
                  center: coors,
                  zoom: 15,
                  controls: [],
               }}
               modules={["geolocation", "geocode"]}
               className={style.map}
               height={200}
            >
               <GeolocationControl onLoad={(ymaps) => getGeoLocation(ymaps)}
                                   instanceRef={(map) => handleClick(map)}
                                   {...geoControl}
               />
               <Placemark {...placeMark}
                          onLoad={(e) => onPlacemark(e)}
                          onDragEnd={(e) => dragEvent(e)}
               />
               <ZoomControl options={{float: 'right'}}/>
               <SearchControl options={{float: 'right'}} {...searchControl}/>
               <TypeSelector options={{float: 'left'}}/>
            </Map>
         </YMaps>
      </div>
   )
}