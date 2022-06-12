import { React, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import OccupancyMixedChart from './OccupancyMixedChart';
import BuildingService from '../../services/building.service';
import SafetyLevel from '../components/SafetyLevel';
import Occupancy from '../components/Occupancy';

/**
 * Building chart to display safety level, capacity and live occupancy data including its rooms
 *
 * @param {*} props
 */
function BuildingChart(props) {
    const [chartData, setChartData] = useState([]);
    const [safetyLevel, setSafetyLevel] = useState(null);
    const [capacity, setCapacity] = useState(0);
    const [occupancy, setOccupancy] = useState(0);

    // Fetch live building data from the API when it's mounted
    useEffect(() => {
        fetchChartData();
        setOccupancy(props.occupancy);
    }, []);

    /**
     * Fetch live building data from the API with 5 seconds interval
     */
    useEffect(() => {
        const interval = setInterval(() => {
            fetchChartData();
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    /**
     * Fetch live building data from the API
     */
    function fetchChartData() {
        BuildingService.get(props.building.id).then((res) => {
            let combinedChartData = [];

            // Get Overall Building Data and push to dataset
            combinedChartData.push({
                label: 'Building',
                labels: res.data.labels || [],
                data: res.data.data || [],
            });

            let totalCapacity = 0;
            let totalOccupancy = 0;
        
            // Get Indiviual Room Data and push to dataset
            res.data.rooms.forEach((room) => {
                combinedChartData.push({
                    label: room.name,
                    labels: room.labels || [],
                    data: room.data || [],
                });

                totalCapacity += room.capacity;
                totalOccupancy += room.occupancy;
            });

            // Update Chart Data
            setChartData(combinedChartData);

            // Update Safety Level
            setSafetyLevel(res.data.safety_level);

            setOccupancy(totalOccupancy);
            setCapacity(totalCapacity);
            
        });
    }

    return (
        <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200">
            <div className="px-5 pt-5">
                <div className='mb-2 flex justify-between'>
                    <span className="text-lg font-semibold text-slate-800">
                        {props.building.name}
                    </span>
                    <Link to={`/building/${props.building.id}`}>
                        <span className="text-xs font-semibold text-blue-500 mb-1 inline-flex items-center hover:text-blue-600 active:text-blue-500">
                            View Rooms
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </Link>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase mb-1">
                        Safety Level
                    </span>
                    <span className="text-xs font-semibold text-slate-400 uppercase mb-1">
                        Occupancy
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <SafetyLevel
                        safety_level={safetyLevel ?? props.safety_level}
                    />
                    <Occupancy
                        capacity={capacity}
                        occupancy={occupancy}
                    />
                </div>
            </div>
            <div className="grow">
                <OccupancyMixedChart
                    chartData={chartData}
                    width={400}
                    height={200}
                    capacity={capacity}
                />
            </div>
        </div>
    );
}

export default BuildingChart;
