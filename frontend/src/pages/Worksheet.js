import React, { useState } from 'react';

import FetchListings from '../queries/ListingsBySeason';
import { Row, Col } from 'react-bootstrap';
import SeasonDropdown from '../components/SeasonDropdown';
import WeekSchedule from '../components/WeekSchedule';
import WorksheetList from '../components/WorksheetList';

import styles from './Worksheet.module.css';

import { useUser } from '../user';

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
  const [listings, addListing] = useState([]);
  const [indx, incrementIndx] = useState(0);
  const [season, setSeason] = useState(recentSeason);

  if (user.worksheet == null) return <div>Please Login</div>;

  const addCourse = courseListing => {
    addListing([...listings, courseListing[0]]);
    incrementIndx(indx + 1);
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

  let season_listings = [];
  listings.forEach(listing => {
    if (listing.season_code === season) season_listings.push(listing);
  });

  // console.log(listings);
  return (
    <div className={styles.container}>
      <Row>
        <Col sm={4} className={styles.table + ' pr-0'}>
          <WorksheetList
            onSeasonChange={changeSeason}
            courses={listings}
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
