import React, { Component, useState } from 'react';

import ReactDataGrid from 'react-data-grid';
import { Toolbar, Data, Filters } from 'react-data-grid-addons';

export default class CoursesTable extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const defaultColumnProperties = {
			filterable: true,
		};

		const test_courses = [
			{
				id: 1,
				subject: 'CPSC',
				number: '223',
				section: '1',
				title: 'Data Structures and Programming Techniques',
			},
			{
				id: 2,
				subject: 'MATH',
				number: '230',
				section: '1',
				title: 'Vector Calculus and Linear Algebra I',
			},
			{
				id: 3,
				subject: 'PLSC',
				number: '257',
				section: '1',
				title: 'Bioethics and Law',
			},
		];

		const selectors = Data.Selectors;
		const {
			NumericFilter,
			AutoCompleteFilter,
			MultiSelectFilter,
			SingleSelectFilter,
		} = Filters;
		const columns = [
			{
			  key: 'subject',
			  name: 'Subject',
			},
			{
				key: 'number',
				name: 'Number',
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
				<ReactDataGrid
					columns={columns}
					rowGetter={i => filteredRows[i]}
					rowsCount={filteredRows.length}
					minHeight={500}
					toolbar={<Toolbar enableFilter={true} />}
					onAddFilter={filter => setFilters(handleFilterChange(filter))}
					onClearFilters={() => setFilters({})}
					getValidFilterValues={columnKey =>
						getValidFilterValues(rows, columnKey)
					}
				/>
			);
		}

		return (
			<div>
				{this.props.courses ? (
					<CoursesDataGrid rows={this.props.courses} />
				) : (
					<div>Loading...</div>
				)}
			</div>
		);
	}
}
