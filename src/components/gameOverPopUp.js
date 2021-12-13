import React from "react";

const PopUp = (props) => {
  return (
    <div id="popUp">
      <div id="card">
        <button name="showPopUp" onClick={props.close}>
          X
        </button>
        <h2>{props.message} </h2>
        <p>Score: {props.score}</p>
      </div>
      <div id="overlay"></div>
    </div>
  );
};

export default PopUp;
