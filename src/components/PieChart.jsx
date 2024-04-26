import React, { useContext } from 'react';
import {  Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { AppContext } from '../context/AppContext';


defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 15;
defaults.plugins.title.color = "black";

// pie chart component
const PieChart = () => {

  const{ deaths, recoveries, population} = useContext(AppContext);

  const sourceData = [
    {
      "label": "TotalPopulation",
      "value": population / 1000000,
    },
    {
      "label": "Deaths",
      "value": deaths / 1000000 
    },
    {
      "label": "Recoveries",
      "value": recoveries / 1000000 
    }
  ]


  return (
    <div className='pieChart'>
      <Doughnut
              data={{
                labels: sourceData.map((data) => data.label),
                datasets: [
                  {
                    label: "Count",
                    data: sourceData.map((data) => data.value),
                    backgroundColor: [
                      "#ffe680",
                      "#ff3333",
                      "#00b33c",
                    ],
                    borderWidth: 0,
                  },
                ],
              }}
              options={{
                plugins: {
                  title: {
                    text: "Pie Chart",
                  },
                  legend: {
                    display: false,
                    labels: {
                      font: {
                        size: 12, 
                        weight: 'bold', 
                      },
                    },
                  },
                  callbacks: {
                    label: function(context) {
                      var label = context.dataset.label || '';
                      if (label) {
                        label += ': ';
                      }
                      label += context.parsed.y.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + 'M'; // Format value with million suffix
                      return label;
                    },
                  },
                },
                layout: {
                  padding: {
                    top: 30,
                  },
                },
                
              }}
            />  
    </div> 
  )
}

export default PieChart;



