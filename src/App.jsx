
import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import { AppContext } from './context/AppContext';
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';
import Spinner from './components/Spinner';



function App() {

  const{countryNames, setCountryNames,
        selectedCountry,setSelectedCountry,
        totalCases, setTotalCases,
        recoveries, setRecoveries,
        deaths, setDeaths,
        allData, setAllData,
        selectedDateRangeIndex,  
        setSelectedDateRangeIndex,
        loading, setLoading,
        error,  setError,
        dateRanges, population, setPopulation } = useContext(AppContext);

 
  
    //function call to fetch countries
    useEffect(() => {
      fetchCountries();
    }, []);

    useEffect(() => {
      fetchCountries();
    }, [selectedCountry])

    //function call to fetch alldata
    useEffect(() => {
      setLoading(true);
      fetchAllDetails(selectedCountry);
    }, [selectedCountry, selectedDateRangeIndex]);

    useEffect(() => {
      if (Object.keys(allData).length > 0) {
        calculateData(allData);
      }
    }, [allData, selectedDateRangeIndex]);

    //API call to fetch allCountries
    async function fetchCountries() {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all"); 
        if (!response.ok) {
          throw new Error(`Failed to fetch countries: ${response.status}`);
        }
        const countries = await response.json();
        setCountryNames(countries);
        setPopulation(countries.population);
      } catch (error) {
        setError(error.message); 
      }
    }

    function handleCountryChange(event) {
      setSelectedCountry(event.target.value);
    }

    function handleDateRangeChange(event) {
      setSelectedDateRangeIndex(parseInt(event.target.value));
    }

   //API Call to fetch all details related to country 
  async function fetchAllDetails(country) {
    try {
      const response = await fetch(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=1500`);
      const data = await response.json();
      setAllData(data);
      setLoading(false); 
      
    } catch (error) {
      console.error("Error fetching details:", error);
      setLoading(false);
    }
  }

  //function to calculate data from API response
  function calculateData(data) {
    if (data.timeline && Object.keys(data.timeline).length > 0) {
      const casesData = data.timeline.cases || {};
      const recoveredData = data.timeline.recovered || {};
      const deathData = data.timeline.deaths || {};
  
      let totalCasesInRange = 0;
      let totalRecoveriesInRange = 0;
      let totalDeathsInRange = 0;
  
      if (selectedDateRangeIndex !== -1) {
        const { startDate, endDate } = dateRanges[selectedDateRangeIndex];
  
        Object.keys(casesData).forEach(date => {
          if (isDateInRange(date, startDate, endDate)) {
            totalCasesInRange = casesData[endDate] - casesData[startDate];
            totalRecoveriesInRange = getLastNonZeroValueInRange(recoveredData, startDate, endDate);
            totalDeathsInRange = (deathData[endDate] || 0) - (deathData[startDate] || 0);
          }
        });
      } else {
        // Default case: country - united states
        const lastDate = Object.keys(casesData).pop();
        totalCasesInRange = casesData[lastDate];
        totalRecoveriesInRange = getLastNonZeroValue(recoveredData);
        totalDeathsInRange = deathData[lastDate] || 0;
      }
  
      setTotalCases(totalCasesInRange);
      setRecoveries(totalRecoveriesInRange);
      setDeaths(totalDeathsInRange);
    } else {
      setTotalCases(0);
      setRecoveries(0);
      setDeaths(0);
    }
  }

  //functioncall to find nonzero value of recoveries
  function getLastNonZeroValueInRange(data, startDate, endDate) {
    let lastNonZeroValue = 0;
    let firstValue = 0;
    let foundNonZeroValue = false;
  
    Object.keys(data).forEach(date => {
      if (isDateInRange(date, startDate, endDate)) {
        if (!foundNonZeroValue && data[date] > 0) {
          firstValue = data[date];
          foundNonZeroValue = true;
        }
        if (data[date] > 0) {
          lastNonZeroValue = data[date];
        }
      }
    });
  
    return lastNonZeroValue - firstValue;
  }
  
  
  function getLastNonZeroValue(data, startDate, endDate) {
    let lastNonZeroValue = 0;
    Object.keys(data).forEach(date => {
      if (isDateInRange(date, startDate, endDate) && data[date] > 0) {
        lastNonZeroValue = data[date];
      }
    });
    return lastNonZeroValue;
  }
  
  //function to check the data in range data
  function isDateInRange(date, startDate, endDate) {
    const currentDate = new Date(date);
    const rangeStartDate = new Date(startDate);
    const rangeEndDate = new Date(endDate);
    return currentDate >= rangeStartDate && currentDate <= rangeEndDate;
  }

  function formatTotal(number) {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    } else {
      return number.toString();
    }
  };

  //logic to find the selectedCountry population
  const selectedCountryData = countryNames.find(country => country.name.common === selectedCountry);

  if (selectedCountryData) {
        setPopulation(selectedCountryData.population); 
    } else {
      console.log("Selected country data not found");
  }

  return (
    <div className='wrapper'>
      <div className='container'>

      <h1 className='main-heading'>COVID-19 & Population DashBoard</h1>

      <div className='dropdown-section'>
        <div className='selectCountries'>
          <select value={selectedCountry} onChange={handleCountryChange} className='select-country'>
            { error ? 
              ( 
                <p>Error: {error}</p>
              ) :
              (
                countryNames.map((country, index) => (
                  <option key={index} value={country.name.common} >{country.name.common}</option>
                ))
              ) } 
          </select>
        </div>


        <div className='selectDates'>
          <span className=''>Filter by Date Range</span>
          <select value={selectedDateRangeIndex} onChange={handleDateRangeChange} className=''>
            {dateRanges.map((range, index) => (
              <option key={index} value={index}>{range.startDate} - {range.endDate}</option>
            ))}
          </select>
        </div>

      </div>
        
        {loading ? (
          <Spinner/>
        ) : 
        (
            <div className='allData'>
                  {allData && allData.timeline ? (
                    < >
                    <div className='allValues'>
                      <p className='value1'>Total Cases <span>{formatTotal(totalCases)}</span> </p>
                      <p className='value2'>Recoveries <span>{formatTotal(recoveries)}</span> </p>
                      <p className='value3'>Deaths <span>{formatTotal(deaths)}</span> </p>

                    </div>
                      
                    </>
                  ) : (
                    <>
                    <div className='error-msg'>
                      <p>Country not found or doesn't have any historical data</p>
                      <p>Try for another country</p>
                      <button onClick={() => setSelectedCountry('United States')}>Try another country</button>
                    </div>
                      
                    </>
                  )}
            </div>
        )}

        <div >

          {
            allData && allData.timeline && !loading ?
             (
              <div className='charts'>
                <div >
                  <LineChart />
                </div>
  
                <div className='piech'>
                  <PieChart /> 
                </div>
              </div>
              
             ) :
             (
              <div>
                {console.log("No data Found")}
              </div>
             )
          }
        </div>
      </div>
    </div>
  );
}

export default App;


