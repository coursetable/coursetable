import React from 'react';

import FetchListings from '../queries/ListingsBySeason'
import CoursesTable from '../components/CoursesTable'

import styles from './Courses.module.css';

import flatten from '../utilities'

function App() {

  const {loading, error, data} = FetchListings("201902")

  if (loading | error) return <div>Loading...</div>;

  return <CoursesTable courses={data.listings.map((x)=>{return flatten(x)})}/>;
}

export default App;