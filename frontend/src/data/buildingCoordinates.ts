import buildingCoordinatesJson from './buildingCoordinates.json';

export type BuildingCoordinate = {
  lat: number;
  lng: number;
  name?: string;
};

const buildingCoordinates = buildingCoordinatesJson as {
  [key: string]: BuildingCoordinate;
};

export default buildingCoordinates;
