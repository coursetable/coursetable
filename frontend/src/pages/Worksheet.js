import React, { useState } from 'react';

import FetchListings from '../queries/ListingsBySeason';
import { Row, Col } from 'react-bootstrap';
import SeasonDropdown from '../components/SeasonDropdown';
import WeekSchedule from '../components/WeekSchedule';
import WorksheetList from '../components/WorksheetList';

import styles from './Worksheet.module.css';

import { useUser } from '../user';
import { isInWorksheet } from '../utilities';

function Worksheet() {
  const { user } = useUser();
  let recentSeason = '200903';
  let season_codes = [];
  if (user.worksheet) {
    user.worksheet.forEach(szn => {
      if (szn[0] > recentSeason) recentSeason = szn[0];
      if (season_codes.indexOf(szn[0]) === -1) season_codes.push(szn[0]);
    });
  }
  const [courses_info, setInfo] = useState([0, []]);
  const indx = courses_info[0];
  const listings = courses_info[1];
  const [season, setSeason] = useState(recentSeason);

  if (user.worksheet == null) return <div>Please Login</div>;

  const addCourse = courseListing => {
    setInfo([courses_info[0] + 1, [...courses_info[1], courseListing[0]]]);
  };

  const changeSeason = season_code => {
    setSeason(season_code);
    console.log(season_code);
  };

  if (user.worksheet.length === 0)
    return <div>Please add courses to your worksheet</div>;

  const { loading, error, data } = FetchListings(
    user.worksheet[Math.min(indx, user.worksheet.length - 1)][0],
    parseInt(user.worksheet[Math.min(indx, user.worksheet.length - 1)][1])
  );
  if (loading || error) return <div>Loading...</div>;
  if (data === undefined || !data.length) return <div>Error with Query</div>;
  if (indx < user.worksheet.length) {
    addCourse(data);
  }

  let filtered_listings = [];
  listings.forEach(listing => {
    if (
      isInWorksheet(listing.season_code, listing.crn.toString(), user.worksheet)
    )
      filtered_listings.push(listing);
  });

  let season_listings = [];
  filtered_listings.forEach(listing => {
    if (listing.season_code === season) season_listings.push(listing);
  });

  return (
    <div className={styles.container}>
      <Row>
        <Col sm={4} className={styles.table + ' pr-0'}>
          <WorksheetList
            onSeasonChange={changeSeason}
            courses={filtered_listings}
            season_codes={season_codes}
            cur_season={season}
          />
        </Col>
        <Col sm={8} className={styles.calendar + ' pl-0'}>
          {/* <SeasonDropdown
            onSeasonChange={changeSeason}
            cur_season={season}
            season_codes={season_codes}
          /> */}
          <WeekSchedule courses={season_listings} />
        </Col>
      </Row>
    </div>
  );
}

export default Worksheet;
