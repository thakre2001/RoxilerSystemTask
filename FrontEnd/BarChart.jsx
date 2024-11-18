import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';


const BarChart = ({ month }) => {
  const [chartData, setChartData] = useState([]);

  return (
    <div className="card p-4 mb-4">
      {/* <Bar data={data} /> */}
    </div>
  );
};


export default BarChart
