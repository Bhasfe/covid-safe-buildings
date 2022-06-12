import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RoomChart from '../partials/dashboard/RoomChart';
import Header from '../partials/Header';

import BuildingService from '../services/building.service';

function Building() {

    const [building, setBuilding] = useState({});

    let { id } = useParams();

    useEffect(() => {
        BuildingService.get(id).then((res) => {
            setBuilding(res.data);
        });
    }, []);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/*  Site header */}
                <Header />

                <main>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        {/* Cards */}
                        <div className="grid gap-6">
                            {/* Table (Top Channels) */}
                            <p className="text-black text-xl font-medium">
                                {building.name}
                            </p>

                            <div className="grid grid-cols-12 gap-6">
                                {building?.rooms?.map((room) => (
                                    <RoomChart room={room} key={room.id} />
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Building;
