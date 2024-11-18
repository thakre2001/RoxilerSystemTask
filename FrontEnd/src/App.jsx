import React, { useState } from 'react'
import DropDown from './Components/DropDown';
import StatisticsBox from './Components/StatisticsBox';
import SearchBox from './Components/SearchBox';
import TransactionTable from './Components/TransactionTable';
import BarChart from './Components/BarChart';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const App = () => {
    const [month, setMonth] = useState("03"); // Default to March
    const [searchText, setSearchText] = useState("");
    return (
      <div className="container mt-4 bg-dark vh-100 d-flex flex-column justify-content-around">
        <h1 className="text-center mb-4">Transactions Dashboard</h1>
        <div className="row mb-4">
          <div className="col-md-6">
            <DropDown selectedMonth={month} setSelectedMonth={setMonth} />
          </div>
          <div className="col-md-6">
            <SearchBox searchText={searchText} setSearchText={setSearchText} />
          </div>
        </div>
        <StatisticsBox month={month} />
        <TransactionTable month={month} searchText={searchText} />
        <BarChart month={month} />
      </div>
    );
  
}

export default App

