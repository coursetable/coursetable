import React, { useState, useMemo } from 'react';
import SearchResults from './SearchResults';
import FBReactSelect from './FBReactSelect';
import SeasonReactSelect from './SeasonReactSelect';

// import { useEffect, useState, useRef, useMemo } from 'react';
import { sortbyOptions } from '../queries/Constants';
import styles from './WorksheetExpandedList.module.css';
import select_styles from './WorksheetRowDropdown.module.css';
import worksheet_styles from '../pages/Worksheet.module.css';
import search_styles from '../pages/Search.module.css';
import { Col, Row } from 'react-bootstrap';
import { useUser } from '../user';
import { FaCompressAlt } from 'react-icons/fa';
import CustomSelect from './CustomSelect';
import orderBy from 'lodash/orderBy';
import { SurfaceComponent, StyledExpandBtn } from './StyledComponents';
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
  FcNumericalSorting12,
  FcNumericalSorting21,
} from 'react-icons/fc';
import styled from 'styled-components';

const StyledSortBtn = styled.div`
  &:hover {
    background-color: ${({ theme }) => theme.banner};
  }
`;

/**
 * Render expanded worksheet list after maximize button is clicked
 * @prop courses - list of listings dictionaries
 * @prop showModal - function to show modal for a certain listing
 * @prop cur_expand - string | Determines whether or not the list is expanded
 * @prop cur_season - string that holds the current season code
 * @prop season_codes - list of season codes
 * @prop onSeasonChange - function to change season
 * @prop setFbPerson - function to change FB person
 * @prop fb_person - string of current person who's worksheet we are viewing
 * @prop setCurExpand - function to minimize the expanded list view
 */

const WorksheetExpandedList = ({
  courses,
  showModal,
  cur_expand,
  cur_season,
  season_codes,
  onSeasonChange,
  setFbPerson,
  fb_person,
  setCurExpand,
}) => {
  const { user } = useUser();
  const [isList, setView] = useState(true);
  // State that controls sortby select
  const [select_sortby, setSelectSortby] = useState(sortbyOptions[0]);
  // State that determines sort order
  const [sort_order, setSortOrder] = useState('asc');

  const handleSortOrder = () => {
    if (sort_order === 'asc') setSortOrder('desc');
    else setSortOrder('asc');
  };

  const WorksheetData = useMemo(() => {
    let sortParams = select_sortby.value;
    let ordering = null;
    if (sortParams === 'course_code') {
      ordering = { course_code: sort_order };
    } else if (sortParams === 'course_title') ordering = { title: sort_order };
    else if (sortParams === 'course_number') ordering = { number: sort_order };
    else if (sortParams === 'rating') ordering = { average_rating: sort_order };
    else if (sortParams === 'workload')
      ordering = { average_workload: sort_order };
    else if (sortParams === 'professor')
      ordering = { average_professor: `${sort_order}_nulls_last` };
    else if (sortParams === 'gut')
      ordering = { average_gut_rating: `${sort_order}_nulls_last` };
    else console.error('unknown sort order - ', sortParams);

    // Apply sorting order.
    // Force anything that is null to the bottom.
    // In case of ties, we fallback to the course code.
    const key = Object.keys(ordering)[0];
    const order_asc = ordering[key].startsWith('asc');
    const listings = orderBy(
      courses,
      [
        (listing) => !!listing[key],
        (listing) => listing[key],
        (listing) => listing.course_code,
      ],
      ['desc', order_asc ? 'asc' : 'desc', 'asc']
    );
    return listings;
  }, [courses, select_sortby, sort_order]);

  return (
    <div className={styles.container}>
      <Row className="mx-auto">
        {/* Season and FB friends dropdown */}
        <Col md={3} className="p-0">
          <SurfaceComponent layer={0} className={styles.select_col + ' p-2'}>
            <Row className="mx-auto">
              <div
                className={
                  select_styles.select_container +
                  ' ' +
                  select_styles.hover_effect
                }
              >
                <SeasonReactSelect
                  cur_season={cur_season}
                  season_codes={season_codes}
                  onSeasonChange={onSeasonChange}
                />
              </div>
            </Row>
            <Row className="mx-auto my-2">
              <div
                className={
                  select_styles.select_container +
                  (user.fbLogin ? ' ' + select_styles.hover_effect : '')
                }
              >
                <FBReactSelect
                  cur_season={cur_season}
                  setFbPerson={setFbPerson}
                  cur_person={fb_person}
                />
              </div>
            </Row>
            <Row className="mx-auto">
              <div className={`${styles.sortby_container}`}>
                {/* Sort By Select */}
                <CustomSelect
                  value={select_sortby}
                  options={sortbyOptions}
                  menuPortalTarget={document.body}
                  onChange={(options) => {
                    setSelectSortby(options);
                  }}
                />
              </div>
              <StyledSortBtn
                className={search_styles.sort_btn + ' my-auto'}
                onClick={handleSortOrder}
              >
                {select_sortby.value === 'course_code' ||
                select_sortby.value === 'course_title' ? (
                  // Sorting by letters
                  sort_order === 'asc' ? (
                    <FcAlphabeticalSortingAz
                      className={search_styles.sort_icon}
                      size={20}
                    />
                  ) : (
                    <FcAlphabeticalSortingZa
                      className={search_styles.sort_icon}
                      size={20}
                    />
                  )
                ) : // Sorting by numbers
                sort_order === 'asc' ? (
                  <FcNumericalSorting12
                    className={search_styles.sort_icon}
                    size={20}
                  />
                ) : (
                  <FcNumericalSorting21
                    className={search_styles.sort_icon}
                    size={20}
                  />
                )}
              </StyledSortBtn>
            </Row>
            <StyledExpandBtn
              className={worksheet_styles.expand_btn + ' ' + styles.top_left}
            >
              <FaCompressAlt
                size={12}
                className={worksheet_styles.expand_icon}
                onClick={() => {
                  // Compress list
                  setCurExpand('none');
                }}
              />
            </StyledExpandBtn>
          </SurfaceComponent>
        </Col>
        {/* Worksheet courses in search results format */}
        <Col md={9} className="pr-0 pl-3">
          <div className={styles.search_results}>
            <SearchResults
              data={WorksheetData}
              showModal={showModal}
              expanded={cur_expand !== 'list'}
              isLoggedIn={true}
              isList={isList}
              setView={setView}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default React.memo(WorksheetExpandedList);
