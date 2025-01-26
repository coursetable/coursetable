import fs from 'node:fs/promises';
import { getSdk, type BuildingQuery } from './building.queries.js';
import { STATIC_FILE_DIR, graphqlClient } from '../config.js';
import winston from '../logging/winston.js';

export async function fetchBuildingData() {
  try {
    const building: BuildingQuery = await getSdk(graphqlClient).building();

    const transformedBuildings = building.buildings
      .map((x) => ({
        building_name: x.building_name,
        code: x.code,
        url: x.url,
      }))
      .sort((a, b) => {
        const nameA = a.building_name?.toLowerCase() ?? '';
        const nameB = b.building_name?.toLowerCase() ?? '';
        return nameA.localeCompare(nameB);
      });

    await fs.writeFile(
      `${STATIC_FILE_DIR}/building.json`,
      JSON.stringify(transformedBuildings),
      'utf-8',
    );
  } catch (err) {
    winston.error(err);
    throw err;
  }
}
