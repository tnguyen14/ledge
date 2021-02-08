import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { showMore } from '../actions/weeks';
import Week from './week';
import Field from '../components/field';

function Weeks(props) {
  const { weeks, showMore } = props;
  const [filter, setFilter] = useState('');
  return (
    <div className="transactions">
      <div className="top-actions">
        <Button onClick={showMore.bind(null, true)}>Look Ahead</Button>
        <Field
          type="text"
          value={filter}
          label="Search"
          placeholder="Search"
          handleChange={(event) => {
            setFilter(event.target.value);
          }}
        />
      </div>
      <div className="weeks">
        {Object.keys(weeks)
          .sort((a, b) => b - a)
          .map((week) => {
            return <Week key={week} offset={Number(week)} filter={filter} />;
          })}
      </div>
      <Button variant="success" onClick={showMore.bind(null, false)}>
        Show More
      </Button>
    </div>
  );
}

Weeks.propTypes = {
  weeks: PropTypes.object.isRequired,
  showMore: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    weeks: state.weeks
  };
}

export default connect(mapStateToProps, {
  showMore
})(Weeks);
