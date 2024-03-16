import React from 'react';
import ThankYouImage from '../images/thankyou.svg';

function Thankyou() {
  return (
    <div className="text-center py-5">
      <h3>Thank You!</h3>
      <div>Your response has been recorded.</div>
      <img
        alt="No courses found."
        className="py-5"
        src={ThankYouImage}
        style={{ width: '25%' }}
      />
    </div>
  );
}

export default Thankyou;
