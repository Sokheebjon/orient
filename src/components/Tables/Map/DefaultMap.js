import React, {useState} from "react";
import {YMaps, Map} from "react-yandex-maps";

export default function DefaultMap(props) {
   const [location, setLocation] = useState('');
   const [coors, setCoors] = useState('');

   const userData = [
      {
         location: location,
         coordinates: coors
      }
   ];
   if (userData[0].coordinates) {
      localStorage.setItem('userData', JSON.stringify(userData))
      // console.log(userData)
   }
   let data = JSON.parse(localStorage.getItem('userData'))

   const getGeoLocation = (ymaps) => {
      ymaps.geolocation.get({
         provider: 'browser',
         autoReverseGeocode: true,
         useMapMargin: true
      }).then(function (result) {
         ymaps.geocode(result.geoObjects.position).then(res => {
            let position = res.geoObjects.get(0).properties.getAll();
            if (data) {
               setLocation(data[0].location)
               setCoors(data[0].coordinates)
            } else {
               setLocation(position.text)
               setCoors(result.geoObjects.position)
            }
         })
      });
   };

   return (
      <div style={{display: 'none'}}>
         <YMaps query={{apikey: 'a611d201-19b9-4184-98c3-e7d6c4de6c1d'}}>
            <Map
               defaultState={{
                  center: [41.311081, 69.240562],
                  zoom: 10,
                  controls: [],
               }}
               modules={["geolocation", "geocode"]}
               onLoad={(ymaps) => getGeoLocation(ymaps)}
            >
            </Map>
         </YMaps>
      </div>
   )
}