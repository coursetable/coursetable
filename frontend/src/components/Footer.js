import React from 'react';

import styles from './Footer.module.css';
import common_styles from '../styles/common.module.css';
import { NavLink } from 'react-router-dom';

function App() {
  return (
    <footer className={'container py-5 px-5 text-light '+styles.footer}>
      <div className='row'>
        <div className='col-12 col-md'>
          <span className={common_styles.coursetable_logo}>Course<span style={{ color: '#92bcea' }}>Table</span></span>
          <small className='d-block mb-3'>&copy; 2020</small>
        </div>
        <div className='col-6 col-md'>
          <h5>Explore courses</h5>
          <ul className='list-unstyled text-small'>
            <li>
              <NavLink to='/courses' className='text-light'>Current</NavLink>
            </li>
            <li>
              <NavLink to='/historical' className='text-light'>Historical</NavLink>
            </li>
          </ul>
        </div>
        <div className='col-6 col-md'>
          <h5>Support</h5>
          <ul className='list-unstyled text-small'>
            <li>
              <NavLink to='/faq' className='text-light'>FAQ</NavLink>
            </li>
            <li>
              <NavLink to='/changelog' className='text-light'>Changelog</NavLink>
            </li>
            <li>
              <NavLink to='/feedback' className='text-light'>Feedback</NavLink>
            </li>
          </ul>
        </div>
        <div className='col-6 col-md'>
          <h5>About</h5>
          <ul className='list-unstyled text-small'>
            <li>
              <NavLink to='/about' className='text-light'>Team</NavLink>
            </li>
            <li>
              <NavLink to='/joinus' className='text-light'>Join us</NavLink>
            </li>
            <li>
              <NavLink to='/team' className='text-light'>GitHub</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default App;
