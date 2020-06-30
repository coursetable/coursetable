import React, { useState } from 'react';

import FetchListings from '../queries/ListingsBySeason';
import CoursesTable from '../components/CoursesTable';

import styles from './Worksheet.module.css';

import { useUser } from '../user';

function App() {
  const [listings, addListing] = useState([]);
  const [indx, incrementIndx] = useState(0);

  const addCourse = courseListing => {
    addListing([...listings, courseListing[0]]);
    incrementIndx(indx + 1);
  };

  const { user } = useUser();

  if (user.worksheet == null) return <div>loading...</div>;

  const { loading, error, data } = FetchListings(
    user.worksheet[indx][0],
    parseInt(user.worksheet[indx][1])
  );
  if (loading | error) return <div>Loading...</div>;

  if (indx < user.worksheet.length - 1) addCourse(data);
  console.log(listings);

  return <CoursesTable courses={listings} />;
}

export default App;
