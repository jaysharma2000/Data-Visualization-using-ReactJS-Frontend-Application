import React, { useContext } from 'react';
import {  Line } from "react-chartjs-2";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { AppContext } from '../context/AppContext';


defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 15;
defaults.plugins.title.color = "black";

//Linechart component
const LineChart = () => {

  const{totalCasesArray, deathsArray, recoveriesArray} = useContext(AppContext);

  return (
    <div className="lineChartContainer">
      <Line
          data={{
            labels: totalCasesArray.map((data) => "20" + data.date.split('/')[2]),
            datasets: [
              {
                label: "TotalCases",
                data: totalCasesArray.map((data) => data.value),
                backgroundColor: "#7070db",
                borderColor: "#7070db",
                pointRadius: 2,
              },
              {
                label: "Recoveries",
                data: recoveriesArray.map((data) => data.value),
                backgroundColor: "#00b33c",
                borderColor: "#00b33c",
                
                pointRadius: 2,
              },
              {
                label: "Deaths",
                data: deathsArray.map((data) => data.value),
                backgroundColor: "#ff3333",
                borderColor: "#ff3333",
                pointRadius: 2,
              },
            
            ],
          }} 
          options={{
            scales:{
              x:{
                border: {
                  width: 2,
                  color: 'black', 
                },
                grid: {
                  display: false, 
                },
                ticks: {
                  color: 'black', 
                  font: {
                    weight: 'bold', 
                  },
                },
              },
              y:{
                grid: {
                  display: false, 
                },
                border: {
                  width: 2,
                  color: 'black',
                },
                ticks: {
                  color: 'black', 
                  font: {
                    weight: 'bold', 
                  },
                },
              }
            },

            elements: {
              line: {
                tension: 0,
              },
            },
            plugins: {
              title: {
                text: "Line Chart",
              },
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    
                    let label = context.dataset.label || '';
                    let value = context.parsed.y;
                    return label + ': ' + value + ' M';
                  }
                },
              },
              
            },
          }}
        />
    </div>
  );
};

export default LineChart; 
