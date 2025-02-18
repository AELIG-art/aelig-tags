import React from 'react';

const Empty = () => {
  return (
    <div className="container d-flex flex-column justify-content-center">
      <div className="row justify-content-center mb-5">
        <img
          src="empty.png"
          className="img-fluid"
          alt=""
          style={{ maxWidth: '500px' }}
        />
      </div>
      <div className="row">
        <div className="col">
          <p>The tag is empty.</p>
        </div>
      </div>
    </div>
  );
};

export default Empty;
