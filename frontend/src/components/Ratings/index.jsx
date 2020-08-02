import React from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

import { range } from "../../helpers/array";
import styles from "./styles.module.scss";

const RATINGS_MAX = 5;

const Ratings = ({ rating }) => {
  const starCount = Math.floor(rating);
  const showHalfStar = starCount < Math.round(rating);
  const emptyStarCount = RATINGS_MAX - starCount - showHalfStar;

  return (
    <div className={styles.ratings}>
      {range(starCount).map((key) => (
        <div className={styles.star} key={key}>
          <FaStar />
        </div>
      ))}
      {showHalfStar && (
        <div className={styles.star} key={starCount}>
          <FaStarHalfAlt />
        </div>
      )}
      {range(emptyStarCount).map((key) => (
        <div className={styles.star} key={key + starCount + showHalfStar}>
          <FaRegStar />
        </div>
      ))}
    </div>
  );
};

export default Ratings;
