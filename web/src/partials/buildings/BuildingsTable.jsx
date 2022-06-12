import React from 'react';
import { NavLink } from 'react-router-dom';
import Occupancy from '../components/Occupancy';
import SafetyLevel from '../components/SafetyLevel';

function BuildingsTable({ buildings }) {
    return (
        <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-slate-200">
            <header className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">Buildings</h2>
            </header>
            <div className="p-3">
                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="table-auto w-full">
                        {/* Table header */}
                        <thead className="text-xs uppercase text-slate-400 bg-slate-50 rounded-sm">
                            <tr>
                                <th className="p-2">
                                    <div className="font-semibold text-left">
                                        Building
                                    </div>
                                </th>
                                <th className="p-2">
                                    <div className="font-semibold text-center">
                                        Safety Level
                                    </div>
                                </th>
                                <th className="p-2">
                                    <div
                                        className="font-semibold text-center"
                                        title="Occupancy / Capacity"
                                    >
                                        Occup. / Cap.
                                    </div>
                                </th>
                                <th className="p-2">
                                    <div className="font-semibold text-center">
                                        Room Count
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        {/* Table body */}
                        <tbody className="text-sm font-medium divide-y divide-slate-100">
                            {buildings.map((building) => (
                                <tr key={building.id}>
                                    <BuildingName building={building} />
                                    <SafetyLevel
                                        safety_level={building.safety_level}
                                        output_type="table"
                                    />
                                    <Occupancy
                                        capacity={building.capacity}
                                        occupancy={building.occupancy}
                                        output_type="table"
                                    />
                                    <RoomCount building={building} />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function BuildingName({ building }) {
    return (
        <td className="p-2">
            <NavLink end to={'/building/' + building.id}>
                <div className="text-left text-slate-600 text-sm font-semibold">
                    <span className="font-semibold text-slate-500">
                        {building.name}
                    </span>
                </div>
            </NavLink>
        </td>
    );
}

function RoomCount({ building }) {
    return (
        <td className="p-2">
            <NavLink end to={'/building/' + building.id}>
                <div className="text-center text-slate-600 text-sm font-semibold">
                    <span className="font-semibold text-slate-500">
                        {building.rooms.length +
                            (building.rooms.length > 1 ? ' rooms' : ' room')}
                    </span>
                </div>
            </NavLink>
        </td>
    );
}

export default BuildingsTable;
