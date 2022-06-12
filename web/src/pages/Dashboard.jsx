import React, { useEffect, useState } from 'react';
import BuildingChart from '../partials/dashboard/BuildingChart';
import Header from '../partials/Header';
import BuildingService from '../services/building.service';

function Dashboard() {
    const [buildings, setBuildings] = useState([]);
    useEffect(() => {
        BuildingService.getAllBuildings().then((res) => {
            setBuildings(res.data.buildings);
        });
    }, []);

    return (
        <div className="flex h-screen overflow-hidden">

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/*  Site header */}
                <Header />

                <main>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto  max-w-9xl">
                        {/* Dashboard actions */}
                        <div className="sm:flex sm:justify-between sm:items-center mb-8">
                            <p className="text-black text-xl font-medium">
                                Buildings Overview
                            </p>
                        </div>

                        {/* Cards */}
                        <div className="grid grid-cols-12 gap-6">
                            {buildings.map((building) => (
                                <BuildingChart
                                    building={building}
                                    key={building.id}
                                />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
