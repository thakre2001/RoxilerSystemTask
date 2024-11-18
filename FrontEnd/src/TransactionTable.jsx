import React, { useEffect, useState } from 'react'
import axios from 'axios';
const TransactionTable = ({ month, searchText }) => {
    const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/transactions", {
        params: { month, search: searchText, page },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [month, searchText, page]);

  return (
    <div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-primary"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TransactionTable

