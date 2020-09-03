import React, {useEffect, useState} from 'react'
import { line } from "react-chartjs-2";


function LineGraph() {

    const [data, setData] = useState({});

    
    const buildChartData = (data, casesType="cases") => {
        const chartData = [];
        let lastDataPoint; 

        for(let date in data.cases) {
            if(lastDataPoint){
                const newDataPoint ={
                    x: date,
                    y: data[casesType][date] -lastDataPoint
                };
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    }

    useEffect(()=>{
        fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then(response => response.json())
        .then(data => {
            const chartData = buildChartData(data);
            setData(chartData);
        });
    },[]);


    return (
        <div>
        <Line data={{
            datasets: [{
                data: data
            }]
        }} />
        </div>
    )
}

export default LineGraph
