import React from 'react';

import FetchListings from '../queries/ListingsBySeason'
import CoursesTable from '../components/CoursesTable'

import styles from './Courses.module.css';


function App() {

  const {loading, error, data} = FetchListings("201902")

  if (loading | error) return <div>Loading...</div>;

  console.log(data);

  return <CoursesTable courses={data.listings}/>;
}

export default App;