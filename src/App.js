import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import './App.css';
import InfoBox from './InfoBox';
import Map from "./Map";
import Table from "./Table";
import {sortData} from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";


function App() {

  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] =useState({});
  const [countries, setCountries] =useState([]);
  const [mapCountries, setMapCountries ] = useState([]);
  const [tableData, setTableData] =useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom ] = useState(3);

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  },[]);

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

        let sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);

      });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async(event)=>{
    const countryCode =event.target.value;

    const url = countryCode === `worldwide`
    ? "https://disease.sh/v3/covid-19/all" 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response =>  response.json())
    .then((data) => {
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    });
  };

  return (
    <div className="app">
      <div className="app__left">
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
          <InfoBox 
            title="CoronaVirus Cases"
            cases={countryInfo.todayCases} 
            total={countryInfo.cases}/>
            
          <InfoBox 
            title="Recovered" 
            cases={countryInfo.todayRecovered} 
            total={countryInfo.recovered}
            />

          <InfoBox 
            title="Deaths" 
            cases={countryInfo.todayDeaths} 
            total={countryInfo.deaths}
            />

        </div>

        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
         />
        
      </div> 
      
      <Card className="app__right">

        <CardContent>
          <h3>Live Cases by country</h3>
          
          <Table countries={tableData} />
          <div className="push">
          <h3>Worldwide new </h3>
          </div>
          <LineGraph casesType={casesType}/>

        </CardContent>

      </Card>

    </div>
  );
}

export default App;
