import React, { useState } from 'react';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import styles from './Courses.module.css';
import { Card, CardDeck, Button } from 'react-bootstrap';
import pic from '../images/default_pfp.png';

import ReactDataGrid from "react-data-grid";
import { Toolbar, Data, Filters } from "react-data-grid-addons";

function App() {

  const defaultColumnProperties = {
  filterable: true,
  };

const test_courses = [
  {
    id: 1,
    subject: "CPSC",
    number: "223",
    section: "1",
    title: "Data Structures and Programming Techniques"
  },
  {
    id: 2,
    subject: "MATH",
    number: "230",
    section: "1",
    title: "Vector Calculus and Linear Algebra I"
  },
  {
    id: 3,
    subject: "PLSC",
    number: "257",
    section: "1",
    title: "Bioethics and Law"
  }
]

const selectors = Data.Selectors;
const {
  NumericFilter,
  AutoCompleteFilter,
  MultiSelectFilter,
  SingleSelectFilter
} = Filters;
const columns = [
  {
    key: "id",
    name: "ID",
    filterRenderer: NumericFilter
  },
  {
    key: "subject",
    name: "Subject",
  },
  {
    key: "number",
    name: "Number",
  },
  {
    key: "section",
    name: "Section",
  },
  {
    key: "title",
    name: "Title",
  },
].map(c => ({ ...c, ...defaultColumnProperties }));

const ROW_COUNT = 10000;

const handleFilterChange = filter => filters => {
  const newFilters = { ...filters };
  if (filter.filterTerm) {
    newFilters[filter.column.key] = filter;
  } else {
    delete newFilters[filter.column.key];
  }
  return newFilters;
};

function getValidFilterValues(rows, columnId) {
  return rows
    .map(r => r[columnId])
    .filter((item, i, a) => {
      return i === a.indexOf(item);
    });
}

function getRows(rows, filters) {
  return selectors.getRows({ rows, filters });
}

function CoursesListing({ rows }) {
  const [filters, setFilters] = useState({});
  const filteredRows = getRows(rows, filters);
  return (
    <ReactDataGrid
      columns={columns}
      rowGetter={i => filteredRows[i]}
      rowsCount={filteredRows.length}
      minHeight={500}
      toolbar={<Toolbar enableFilter={true} />}
      onAddFilter={filter => setFilters(handleFilterChange(filter))}
      onClearFilters={() => setFilters({})}
      getValidFilterValues={columnKey => getValidFilterValues(rows, columnKey)}
    />
  );
}

  // const LIST_COURSES = gql`
  //   query MyQuery {
  //     courses(where: { season_code: { _eq: "201303" } }) {
  //       areas
  //       extra_info
  //       location_times
  //       requirements
  //       short_title
  //       skills
  //       times_long_summary
  //       times_summary
  //       title
  //     }
  //   }
  // `;

  // const CoursesListQuery = () => {
  //   const { loading, error, data } = useQuery(LIST_COURSES);

  //   if (loading) {
  //     return <div>Loading...</div>;
  //   }
  //   if (error) {
  //     console.error(error);
  //     return <div>Error!</div>;
  //   }
  //   console.log(data)

  //   return <div>Hello!</div>;

  // };

  // return <div>{CoursesListQuery()}</div>;
  return <CoursesListing rows={test_courses} />
}

export default App;
