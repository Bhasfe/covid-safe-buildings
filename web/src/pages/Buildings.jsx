import React, { useState, useEffect } from 'react';

import Header from '../partials/Header';
import DashboardAvatars from '../partials/dashboard/DashboardAvatars';
import FilterButton from '../partials/actions/FilterButton';
import Datepicker from '../partials/actions/Datepicker';
import BuildingsTable from '../partials/buildings/BuildingsTable';
import { Link } from 'react-router-dom';
import BuildingService from '../services/building.service';

function Buildings() {

    const [buildings, setBuildings] = useState([]);

    useEffect(() => {
        BuildingService.getAllBuildings().then((res) => {

            setBuildings(res.data.buildings.map((building) => {

                // Calculate and append total building capacity and occupancy by its existing rooms
                
                let totalCapacity = 0;
                let totalOccupancy = 0;

                building.rooms.forEach((room) => {
                    totalCapacity += room.capacity;
                    totalOccupancy += room.occupancy;
                });

                building.capacity = totalCapacity;
                building.occupancy = totalOccupancy;

                return building;
            }));

        });
    }, []);

    return (
        <div className="flex h-screen overflow-hidden">

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/*  Site header */}
                <Header />

                <main>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto max-w-9xl">
                        {/* Dashboard actions */}
                        <div className="sm:flex sm:justify-end sm:items-center mb-8">
                            {/* Right: Actions */}
                            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                                {/* Add view button */}
                                <Link to="/buildings/add">
                                    <button className="btn bg-blue-500 hover:bg-blue-600 text-white">
                                        <svg
                                            className="w-4 h-4 fill-current shrink-0"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                                        </svg>
                                        <span className="hidden xs:block ml-2">Add building</span>
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Cards */}
                        <div className="grid gap-6">
                            {/* Table (Top Channels) */}
                            {buildings ? (
                                <BuildingsTable buildings={buildings} />
                            ) : null}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Buildings;
