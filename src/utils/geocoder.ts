import axios from 'axios';
import { MAPS_APIKEY } from '../apiKeys';
import { toast } from 'react-toastify';

export const geoCode = async (address: string) => {
  const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${MAPS_APIKEY}&format=json&geocode=${address}`;
  const { status, data } = await axios(url);
  if (status === 200) {
   const {
     response: {
       GeoObjectCollection: {
         featureMember
       }
     }
   } = data;
   const place = featureMember[0].GeoObject;
   return place.Point.pos.split(' ');
  } else {
    toast.error(data.error_message)
  }
};

export const reverseGeoCode = async (lat: number, lng: number) => {
  const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${MAPS_APIKEY}&format=json&geocode=${lng},${lat}`;
  const { status, data } = await axios(url);
  if (status === 200) {
    const {
      response: {
        GeoObjectCollection: {
          featureMember
        }
      }
    } = data;
    const place = featureMember[0].GeoObject;
    return place.name;
  } else {
    toast.error(data.error_message)
  }
};
