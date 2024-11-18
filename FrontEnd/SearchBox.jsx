import React from 'react'

const SearchBox = ({ searchText, setSearchText }) => {
  return (
    <>
      <input
      type="text"
      className="form-control"
      placeholder="Search transactions..."
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
    />
    </>
  )
}

export default SearchBox
