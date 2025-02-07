import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Weather from "./Weather";  
import "./Battery.css";

const BatteryGraph = () => {
  const [batteryData, setBatteryData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [localTemps, setLocalTemps] = useState([]);
  const [ambientTemp, setAmbientTemp] = useState(null);
  const [currentLocalTemp, setCurrentLocalTemp] = useState(null);


  const handleLocalTempUpdate = (temp) => {
    setCurrentLocalTemp(temp);
  };

  useEffect(() => {
    const fetchTemperatureData = async () => {
      const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      try {
   
        if (currentLocalTemp === null) return;

        // Fetch battery data
        const battery = await navigator.getBattery();
        const batteryTemp = (battery.level * 100).toFixed(1); 

 
        setTimestamps((prev) => [...prev, currentTime]);
        setBatteryData((prev) => [...prev, batteryTemp]);
        setLocalTemps((prev) => [...prev, currentLocalTemp]);

        const newAmbientTemp = ((parseFloat(batteryTemp) + currentLocalTemp) / 2).toFixed(1);
        setAmbientTemp(newAmbientTemp);
      } catch (error) {
        console.error("Error fetching battery data:", error);
      }
    };

    fetchTemperatureData(); 

    const interval = setInterval(fetchTemperatureData, 60000); 

    return () => clearInterval(interval); 
  }, [currentLocalTemp]); 


  const chartData = {
    labels: timestamps,
    datasets: [
      {
        label: "Battery Temperature (°C)",
        data: batteryData,
        borderColor: "#ff5733",
        backgroundColor: "rgba(255, 87, 51, 0.2)",
        borderWidth: 2,
        pointRadius: 4,
      },
      {
        label: "Local Temperature (°C)",
        data: localTemps,
        borderColor: "#3498db",
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        borderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className="battery-container">
      <Weather onLocalTempUpdate={handleLocalTempUpdate} />  

      <h2>Battery & Local Temperature</h2>
      <div className="temperature-info">
        <strong>Battery Temp:</strong> {batteryData[batteryData.length - 1] || "--"}°C | 
        <strong> Local Temp:</strong> {localTemps[localTemps.length - 1] || "--"}°C | 
        <strong> Estimated Room Temp:</strong> {ambientTemp || "--"}°C
      </div>

      <div className="graph-container">
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default BatteryGraph;
