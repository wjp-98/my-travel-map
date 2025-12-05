import request from '@/utils/request';

export interface Location {
    type: 'Point';
    coordinates: [number, number];
  }
  
  export interface City {
    cityName: string;
    location: Location;
  }
  
  export const queryMyCityFootprints = () => {
      return request.get<{
        data: City[];
      }>('/travel-map/my-footprints');
  };