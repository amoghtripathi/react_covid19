import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select } from "@material-ui/core";
import './App.css';
import InfoBox from './InfoBox';
import Map from "./Map";



function App() {

  const [countries, setCountries] =useState([]);
  const [country, setCountry] = useState("worldwide");

  useEffect(() => {
    const getCountriesData= async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=> response.json())
      .then((data)=>{
        const countries = data.map((country)=>(
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));

        setCountries(countries);

      });
    };

    getCountriesData();

  }, []);

  const onCountryChange = async(event)=>{
    const countryCode =event.target.value;

    setCountry(countryCode);
  }

  return (
    <div className="app">
      <div className="app_header">
        <h1>Chinese Virus</h1>
        <FormControl className="app_dropdown">
          <Select variant="outlined" onChange={onCountryChange} value={country}>
          <MenuItem value="worldwide">WorldWide</MenuItem>
            {countries.map((country)=>(
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
                
          </Select>
        </FormControl>
      </div>
      
      <div className="app__stats">

        {/* 3 info boxes  */}
        <InfoBox title="CoronaVirus Cases" cases={1234} total={2000}/>
        
        <InfoBox title="Recovered" cases={1235} total={2002}/>

        <InfoBox title="Deaths" cases={1236} total={2003}/>

      </div>
      
      <div className="app__map">

        <Map />

      </div>

      
    </div>
  );
}

export default App;
