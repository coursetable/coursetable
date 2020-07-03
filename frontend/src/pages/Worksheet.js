import React, { useState } from 'react';

import FetchListings from '../queries/ListingsBySeason';
import { Dropdown, DropdownButton, Row } from 'react-bootstrap';
import CoursesTable from '../components/CoursesTable';
import WeekSchedule from '../components/WeekSchedule';
import FetchSeasonCodes from '../queries/GetSeasonCodes';
import axios from 'axios';

import styles from './Worksheet.module.css';

import { useUser } from '../user';

function App() {
  const [listings, addListing] = useState([]);
  const [indx, incrementIndx] = useState(0);
  const [view, setView] = useState('table');
  const [season, setSeason] = useState('all');

  const addCourse = courseListing => {
    addListing([...listings, courseListing[0]]);
    incrementIndx(indx + 1);
  };

  const handleView = e => {
    console.log(e);
    setView(e);
  };

  const handleSeason = e => {
    console.log(e);
    setSeason(e);
  };

  const { user } = useUser();
  if (user.worksheet == null) return <div>Please Login</div>;
  // console.log(user.worksheet);

  // const { loading_szn, error_szn, data_szn } = FetchSeasonCodes();
  // if (loading_szn || error_szn) return <div>Loading...</div>;
  // console.log(loading_szn);

  if (user.worksheet.length === 0)
    return <div>Please add courses to your worksheet</div>;

  const { loading, error, data } = FetchListings(
    user.worksheet[Math.min(indx, user.worksheet.length - 1)][0],
    parseInt(user.worksheet[Math.min(indx, user.worksheet.length - 1)][1])
  );
  if (loading || error) return <div>Loading...</div>;
  if (data === undefined) return <div>Error with Query</div>;

  if (indx < user.worksheet.length) {
    addCourse(data);
  }
  // console.log(listings);
  return (
    <div className={styles.container}>
      <Row className="mx-1">
        <DropdownButton
          variant="primary"
          title="Worksheet View"
          onSelect={handleView}
        >
          <Dropdown.Item eventKey="table">Table</Dropdown.Item>
          <Dropdown.Item eventKey="calendar">Calendar</Dropdown.Item>
        </DropdownButton>

        <DropdownButton
          variant="success"
          title="Season"
          onSelect={handleSeason}
        >
          <Dropdown.Item eventKey="all">All Seasons</Dropdown.Item>
          <Dropdown.Item eventKey="202001">2020 Spring</Dropdown.Item>
          <Dropdown.Item eventKey="201903">2019 Fall</Dropdown.Item>
        </DropdownButton>
      </Row>
      {view === 'table' ? (
        <CoursesTable courses={listings} />
      ) : (
        <WeekSchedule courses={listings} />
      )}
    </div>
  );
}

export default App;
