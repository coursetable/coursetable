import React, { useState } from 'react';
import { Row } from 'react-bootstrap';
import { useWindowDimensions } from '../components/WindowDimensionsProvider';
import styles from './RatingsGraph.module.css';

import Chart from 'react-apexcharts';

const RatingsGraph = ({ ratings, label, type }) => {
  const [show, setShow] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  var categories = [1, 2, 3, 4, 5];

  if (type == 'yes_no') {
    categories = ['Yes', 'No'];
  }

  return (
    <Row
      className={
        styles.container +
        'py-3 px-1 mx-auto mb-4 justify-content-center align-items-end'
      }
    >
      <Chart
        options={{
          chart: {
            id: 'basic-bar',
            toolbar: {
              show: false,
            },
          },
          xaxis: {
            categories: categories,
          },
          yaxis: {
            show: false,
            // tickAmount: 3,
            // decimalsInFloat: 0,
            // min: 0,
            // title: {
            //   text: 'Count',
            // },
          },
          grid: {
            show: false,
          },
          plotOptions: {
            bar: {
              dataLabels: {
                position: 'top', // top, center, bottom
              },
            },
          },
          dataLabels: {
                enabled: true,
                formatter: function (val) {
                  if(val>0){
                    return val;
                  }
                },
                offsetY: -24,
                style: {
                  fontSize: '12px',
                  colors: ["#304758"]
                }
              },
        }}
        series={[
          {
            name: label,
            data: ratings,
          },
        ]}
        type="bar"
      />
    </Row>
  );
};

export default RatingsGraph;
