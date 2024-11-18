import axios from 'axios';
import React, { useEffect, useState } from 'react'

const StatisticsBox = ({ month }) => {
    
  return (
    <div className="row text-center mb-4">
      <div className="col-md-4">
        <div className="card bg-light shadow-sm">
          <div className="card-body">
            <h5>Total Sales Amount</h5>
            <p className="h4"></p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card bg-light shadow-sm">
          <div className="card-body">
            <h5>Total Sold Items</h5>
            <p className="h4"></p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card  border-warning bg-light shadow-sm">
          <div className="card-body">
            <h5>Total Not Sold Items</h5>
            <p className="h4"></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticsBox
