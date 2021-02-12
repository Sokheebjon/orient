import {YMaps, Map} from 'react-yandex-maps';

export default function StaticMap(props) {

   return (
      <YMaps>
         <p>{props.data.name}</p>
         <Map defaultState={{center: [props.data.latitude, props.data.longitude], zoom: 9}} width={'100%'}
              height={props.height} />
      </YMaps>
   )
};