import React from 'react';

const Error = () => {
  return (
    <div className="container d-flex flex-column justify-content-center">
      <div className="row justify-content-center mb-5">
        <img
          src="tag-error.png"
          className="img-fluid"
          alt=""
          style={{ maxWidth: '500px' }}
        />
      </div>
      <div className="row">
        <div className="col">
          <p>
            The tag is not authentic or the one-time code already used. Please
            retry or contact{' '}
            <a href="mailto:support@aelig.art">support@aelig.art</a> if the
            error persists.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error;
