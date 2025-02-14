import React, { useState, useEffect } from "react";
import Weather from "./components/Weather";
import BatteryGraph from "./components/BatteryGraph";


const App = () => {
  const [localTemp, setLocalTemp] = useState(null);
  const [timestamps, setTimestamps] = useState([]);
  const [batteryData, setBatteryData] = useState([]);
  const [localTemps, setLocalTemps] = useState([]);

  
  const handleLocalTempUpdate = (temperature) => {
    setLocalTemp(temperature);
  };


  useEffect(() => {
    const fetchBatteryTemp = () => {
      navigator.getBattery().then((battery) => {
        const batteryTemp = (battery.level * 100).toFixed(1); // Simulating battery temp
        const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        setTimestamps((prev) => [...prev, currentTime]);
        setBatteryData((prev) => [...prev, batteryTemp]);
        setLocalTemps((prev) => [...prev, localTemp !== null ? localTemp : prev[prev.length - 1] || 0]); // Keep last known temp
      });
    };


    fetchBatteryTemp();
    const interval = setInterval(fetchBatteryTemp, 60000);

    return () => clearInterval(interval);
  }, [localTemp]); 

  return (
    <div className="app">
      <div className="container">
        <BatteryGraph timestamps={timestamps} batteryData={batteryData} localTemps={localTemps} />
      </div>
    </div>
  );
};

export default App;

