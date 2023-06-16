import { SyntheticEvent, useState } from "react";
import "./App.scss";
import { Button } from "antd";
import Resource from "./const/resource";

function App() {
  const sampleImg = [
    Resource.sample,
    Resource.sample,
    Resource.sample,
    Resource.sample,
    Resource.sample,
    Resource.sample,
  ];

  const renderPhotos = (source) => {
    return source.map((photo, index) => {
      return (
        <img
          key={index}
          src={photo}
          alt={index}
          className="col-3 mt-5 nft-image"
        />
      );
    });
  };

  return (
    <div className="container">
      <div className="nav-bar d-flex justify-content-between align-items-center">
        <div className="logo">KNFT</div>
      </div>
      <div className="content mb-5">
        <div className="instruction">
          <div>You can choose at most 3 NFTs</div>
        </div>
        <div className="row">{renderPhotos(sampleImg)}</div>
        <div></div>
      </div>
      <div className="footer">
        <div className="container d-flex justify-content-between align-content-center h-100">
          <div className="my-auto">© Copyright By Dinh Ngoc Khue</div>
          <div className="my-auto">Graduation Research 1</div>
        </div>
      </div>
    </div>
  );
}

export default App;
