import { React, useEffect, useState } from 'react';
import RoomService from '../../services/room.service';
import Occupancy from '../components/Occupancy';
import SafetyLevel from '../components/SafetyLevel';
import OccupancyLineChart from './OccupancyLineChart';
import PeopleStatus from '../components/PeopleStatus';
import { Link } from 'react-router-dom';
import CameraService from '../../services/camera.service';

function RoomChart(props) {
    const [chartData, setChartData] = useState({});
    const [safetyLevel, setSafetyLevel] = useState(null);
    const [occupancy, setOccupancy] = useState(0);
    const [room, setRoom] = useState(props.room);

    const [cameras, setCameras] = useState([]);

    useEffect(() => {
        CameraService.getAll(props.room.building_id).then((res) => {
            setCameras(res.data.cameras);
        });
    }, [setCameras]);

    useEffect(() => {
        fetchChartData();
        setOccupancy(props.room.occupancy);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchChartData();
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const findCameraByRoomId = (roomId) => {
        if (cameras.length > 0) {
            return cameras.filter((camera) => camera.room_id === roomId);
        }
    };

    function fetchChartData() {
        RoomService.get(props.room.building_id, props.room.id).then((res) => {
            setChartData({
                labels: res.data.labels,
                data: res.data.data,
            });

            setSafetyLevel(res.data.safety_level);

            setOccupancy(res.data.occupancy);

            setRoom(res.data);
        });
    }

    return (
        <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200">
            <div className="px-5 pt-5">
                <h2 className="text-lg font-semibold text-slate-800 mb-2">
                    {props.room.name}
                </h2>
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
                        safety_level={safetyLevel ?? room.safety_level}
                    />
                    <Occupancy
                        capacity={room.capacity}
                        occupancy={occupancy}
                        area={room.area}
                    />
                </div>
            </div>
            {/* Chart built with Chart.js 3 */}
            <div className="grow">
                {/* Change the height attribute to adjust the chart height */}
                <OccupancyLineChart
                    chartData={chartData}
                    width={389}
                    height={128}
                    capacity={room.capacity}
                />
            </div>
            <div className="px-5 pt-5">
                <PeopleStatus room={room} />
            </div>
            <div className="px-5 pt-5 pb-5 flex justify-center">
                {findCameraByRoomId(room.id) ? (
                    <button className="bg-red-600 text-white font-semibold py-2 px-4 rounded-sm">
                        <Link
                            to={
                                '/building/' +
                                room.building_id +
                                '/room/' +
                                room.id +
                                '/camera/' +
                                findCameraByRoomId(props.room.id)[0].id
                            }
                            className="flex gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"
                                />
                            </svg>{' '}
                            <span>Live Stream</span>
                        </Link>
                    </button>
                ) : (
                    <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-sm">
                        <Link
                            to={
                                '/building/' +
                                room.building_id +
                                '/room/' +
                                room.id +
                                '/camera'
                            }
                        >
                            Add Camera
                        </Link>
                    </button>
                )}
            </div>
        </div>
    );
}

export default RoomChart;
