// 定义位置类型
export interface Location {
  type: 'Point';
  coordinates: [number, number];
}

// 定义城市类型
export interface City {
  cityName: string;
  location: Location;
}

// 示例数据
export const exampleCity: City = {
  cityName: "武汉",
  location: {
    type: "Point",
    coordinates: [114.304569, 30.593354]
  }
}; 