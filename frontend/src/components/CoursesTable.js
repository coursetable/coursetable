import React, { Component, useState } from 'react';

import ReactDataGrid from 'react-data-grid';
import { Toolbar, Data, Filters } from 'react-data-grid-addons';

import { Button } from 'react-bootstrap';

import { AutoSizer, List } from 'react-virtualized';

import styles from './CoursesTable.module.css';
import WorksheetToggleButton from './WorksheetToggleButton';

function handleWorksheetAdd(e) {
  e.preventDefault();

  console.log();
}

export default class CoursesTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const defaultColumnProperties = {
      filterable: true,
    };

    const selectors = Data.Selectors;

    const {
      NumericFilter,
      AutoCompleteFilter,
      MultiSelectFilter,
      SingleSelectFilter,
    } = Filters;

    const WorkSheetFormatter = ({ row, value }) => {
      return (
        <WorksheetToggleButton crn={row.crn} season_code={row.season_code} />
      );
    };

    const columns = [
      {
        key: 'in_worksheet',
        name: 'WS',
        width: 60,
        formatter: WorkSheetFormatter,
      },
      {
        key: 'subject',
        name: 'Subject',
        width: 80,
      },
      {
        key: 'number',
        name: 'Number',
        width: 80,
      },
      {
        key: 'section',
        name: 'Section',
        width: 80,
      },
      {
        key: 'course.short_title',
        name: 'Name',
        width: 280,
      },
      {
        key: 'course.times_summary',
        name: 'Times',
        width: 240,
      },
      {
        key: 'enrolled',
        name: '#',
        width: 40,
      },
      {
        key: 'avg_rating',
        name: 'Rated (class)',
        width: 120,
      },
      {
        key: 'professor_avg_rating',
        name: 'Rated (prof)',
        width: 120,
      },
      {
        key: 'skills',
        name: 'Skills',
        width: 80,
      },
      {
        key: 'areas',
        name: 'Areas',
        width: 80,
      },
      {
        key: 'avg_workload',
        name: 'Work',
        width: 80,
      },
      {
        key: 'professors',
        name: 'Professor(s)',
        width: 160,
      },
      {
        key: 'course.locations_summary',
        name: 'Location(s)',
        width: 120,
      },
    ].map(c => ({ ...c, ...defaultColumnProperties }));

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

    function CoursesDataGrid({ rows }) {
      const [filters, setFilters] = useState({});
      const filteredRows = getRows(rows, filters);
      return (
        <div style={{ flex: '1 1 auto', height: '100%' }}>
          <AutoSizer>
            {({ height, width }) => (
              <ReactDataGrid
                columns={columns}
                rowGetter={i => filteredRows[i]}
                rowsCount={filteredRows.length}
                toolbar={<Toolbar enableFilter={true} />}
                onAddFilter={filter => setFilters(handleFilterChange(filter))}
                onClearFilters={() => setFilters({})}
                getValidFilterValues={columnKey =>
                  getValidFilterValues(rows, columnKey)
                }
                minWidth={width}
                minHeight={height - 64}
              />
            )}
          </AutoSizer>
        </div>
      );
    }

    return (
      <div className={styles.table}>
        {this.props.courses ? (
          <CoursesDataGrid rows={this.props.courses} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  }
}
