import React from "react";

import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";


const Ratings = ({ rating }) => {
  return (
    <div style={{ display: "inline-flex" }}>
      {[1, 2, 3, 4, 5].map((breakpoint) => (
        <div style={{ marginLeft: "5px", marginRight: "5px" }} key={breakpoint}>
          {breakpoint < rating ? (
            <FaStar />
          ) : breakpoint < rating + 0.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar />
          )}
        </div>
      ))}
    </div>
  );
};

export default Ratings;