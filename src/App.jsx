import axios from "axios";
import React, { useEffect, useState } from "react";
import './App.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bars } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDroplet, faTemperatureThreeQuarters } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [isFetching, setfetching] = useState(false)
  const [place, setPlace] = useState('')
  const [vh] = useState(window.innerHeight);
  const [data, setData] = useState({})
  function fetchData(place) {
    setfetching(true)
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${process.env.REACT_APP_API_KEY}`).then((response) => {
      setfetching(false)
      setData(response.data)
    }).catch(err => {
      setfetching(false)
      if (err.data === undefined) {
        return toast.error('place not found!')
      }
      toast.error(err.message)
    })
  }
  function handleKeyPress(e) {
    if (place && e.key === 'Enter') {
      fetchData(place)
    }
  }

  function formatTimestamp(timestamp) {
    const dateObj = new Date(timestamp * 1000);
    const formattedTime = dateObj.toLocaleTimeString();
    return formattedTime;
  }

  return (
    <div className="main-div" style={{ height: vh }} >
      <div className="App" >
        <div className="container w-100">
          <header className={"header-input row"}>
            <div className="location-setup col-md-6" >
              <input className={"location-input"} onChange={(e) => setPlace(e.target.value)} onKeyPress={(e) => { handleKeyPress(e) }} placeholder={" Enter Location."} />
              <p className={"observations"}>Press Enter to Send.<br />Try the outdoor search in English!</p>
            </div>
            {isFetching ? <></> : (
              <div className="col-md-6" >
                {data?.weather && <p className={"region"}>{data?.name} , {data?.sys?.country}</p>}
              </div>
            )}
          </header>
          {
            !data?.weather ?
              <main className={"main-data"}>
                <img className="w-100 h-100" style={{ objectFit: 'scale-down' }} src={require('./images/sun-smile-transparent.png')} alt="" />
              </main> :
              isFetching ?
                <div className="main-data" >
                  <div className={"temperature"}>
                    <Bars
                      height="150"
                      width="80"
                      color="#75C2F6"
                      ariaLabel="bars-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                    />
                  </div>
                </div>
                : (
                  <div className="row" >
                    <div className="col-md-4 ">
                      <div className="py-2">
                        <FontAwesomeIcon color="white" fontSize={'20px'} icon={faDroplet} /><span className="text-white" > Humidity - {data?.main?.humidity}</span>
                      </div>
                      <div className="py-2">
                        <FontAwesomeIcon color="white" fontSize={'20px'} icon={faTemperatureThreeQuarters} /><span className="text-white" > Max - {data?.main?.temp_max}</span>
                      </div>
                      <div className="py-2">
                        <FontAwesomeIcon color="white" fontSize={'20px'} icon={faTemperatureThreeQuarters} /><span className="text-white" > Min - {data?.main?.temp_min}</span>
                      </div>
                    </div>
                    <main className={"main-data col-md-4"} >
                      <div className={"temperature"}>

                        <p className={"temp"}>{data?.main?.temp} C</p>
                      </div>
                      <div className={"weather"}>
                        <img
                          className="img"
                          src={`http://openweathermap.org/img/w/${data?.weather[0]?.icon}.png`}
                          alt="Weather pic"
                          width={150}
                          height={150}
                        />

                        <p className={"weather-label"}>{data?.weather[0]?.description}</p>
                      </div>
                    </main>
                    <div className="col-md-4">
                      <div className="d-block">
                        <p className="text-white fw-bold" >Sunrise: {formatTimestamp(data?.sys?.sunrise)}</p>
                      </div>
                      <div className="">
                        <p className="text-white fw-bold" >Sunset : {formatTimestamp(data?.sys?.sunset)}</p>
                      </div>
                      <div className="">
                        <p className="text-white fw-bold" >pressure : {data?.main?.pressure}</p>
                      </div>
                    </div>
                  </div>
                )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
