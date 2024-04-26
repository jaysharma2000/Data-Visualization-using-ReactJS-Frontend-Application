import { createContext, useState } from "react";


//createcontext
export const AppContext = createContext();

export default function AppContextProvider({children}){
    //All state management
    const [countryNames, setCountryNames] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('United States');
    const [totalCases, setTotalCases] = useState(0);
    const [recoveries, setRecoveries] = useState(0);
    const [deaths, setDeaths] = useState(0);
    const [allData, setAllData] = useState({});
    const [selectedDateRangeIndex, setSelectedDateRangeIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); 
    const [population, setPopulation] = useState(null);
 
    const dateRanges = [
        { startDate: '1/22/20', endDate: '3/9/23' },
        { startDate: '4/1/20', endDate: '12/31/20' },
        { startDate: '1/1/21', endDate: '9/10/21' },
        { startDate: '11/9/21', endDate: '1/22/22' },
        { startDate: '1/29/22', endDate: '10/31/22' },
        { startDate: '12/29/22', endDate: '3/7/23' }
      ];



    const yearCounts = {};
    const yearCountsDeaths = {};
    const yearCountsRecoveries = {};

     //Converting objects into array of objects for total cases.
    const totalCasesArray = Object.entries(allData?.timeline?.cases || {})
        .filter(([date, value]) => {
            const [, month, day, year] = date.match(/(\d+)\/(\d+)\/(\d+)/);
            const entryYear = parseInt(year);
            yearCounts[entryYear] = (yearCounts[entryYear] || 0) + 1;
            return yearCounts[entryYear] <= 1 ;
    })
    .map(([date, value]) => ({ date, value: (value / 1000000).toFixed(2) })); 


    //Converting objects into array of objects for deaths count.
    const deathsArray = Object.entries(allData?.timeline?.deaths || {})
        .filter(([date, value]) => {
            const [, month, day, year] = date.match(/(\d+)\/(\d+)\/(\d+)/);
            const entryYear = parseInt(year);
            yearCountsDeaths[entryYear] = (yearCountsDeaths[entryYear] || 0) + 1;
            return yearCountsDeaths[entryYear] <= 1 ;
    })
    .map(([date, value]) => ({ date, value: (value / 1000000).toFixed(2) })); 

    //Converting objects into array of objects for recoveries count.
    const recoveriesArray = Object.entries(allData?.timeline?.recovered || {})
        .filter(([date, value]) => {
            const [, month, day, year] = date.match(/(\d+)\/(\d+)\/(\d+)/);
            const entryYear = parseInt(year);
            yearCountsRecoveries[entryYear] = (yearCountsRecoveries[entryYear] || 0) + 1;
            return yearCountsRecoveries[entryYear] <= 1;
    })
    .map(([date, value]) => ({ date, value: (value / 1000000).toFixed(2) })); 



    
    //context 
    const value = {
        countryNames, 
        setCountryNames,
        selectedCountry,
        setSelectedCountry,
        totalCases, 
        setTotalCases,
        recoveries, 
        setRecoveries,
        deaths, 
        setDeaths,
        allData, 
        setAllData,
        selectedDateRangeIndex, 
        setSelectedDateRangeIndex,
        loading, 
        setLoading,
        error, 
        setError,
        dateRanges,
        totalCasesArray,
        deathsArray,
        recoveriesArray,
        population,
        setPopulation

    };

    //contextProvider
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>

}