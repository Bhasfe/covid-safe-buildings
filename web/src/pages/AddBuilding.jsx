import React, { useState, useEffect } from 'react';

import Header from '../partials/Header';

import BuildingService from '../services/building.service';
import RoomService from '../services/room.service';
import AlertComponent from '../partials/alert/alert';

function AddBuilding() {
    const [alert, setAlert] = useState(null);

    const [building, setBuilding] = useState({
        name: '',
        address: '',
        building_type: '',
    });

    const [rooms, setRooms] = useState([]);

    const roomInterface = {
        name: '',
        description: '',
        area: '',
    };

    const submitForm = (e) => {
        e.preventDefault();
        BuildingService.create(building).then((res) => {
            if (res.data.id) {
                rooms.forEach((room) => {
                    RoomService.create(res.data.id, room).then((res) => {
                        if (!res.data.id) {
                            setAlert({
                                type: 'danger',
                                message:
                                    'Error creating room, make sure you filled all fields correctly.',
                            });
                            return;
                        }
                    });
                });
                setAlert({
                    type: 'success',
                    message: 'Building and rooms created successfully.',
                });
                setBuilding({
                    name: '',
                    address: '',
                    building_type: '',
                });
                setRooms([]);
                return;
            }
            setAlert({
                type: 'danger',
                message:
                    'Error creating building, make sure you filled all fields correctly.',
            });
            return;
        });
    };

    const setRoomValue = (e, index, name) => {
        const { value } = e.target;
        let editRoom = rooms[index];
        editRoom[name] = value;
        setRooms([
            ...rooms.slice(0, index),
            editRoom,
            ...rooms.slice(index + 1),
        ]);
    };

    return (
        <div className="flex h-screen overflow-hidden">

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/*  Site header */}
                <Header/>

                <main>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-slate-200">
                            <header className="px-5 py-4 border-b border-slate-100">
                                <h2 className="font-semibold text-slate-800">
                                    Add Building
                                </h2>
                            </header>
                            <div className="px-5 py-4">
                                <form
                                    className="w-full"
                                    onSubmit={(e) => submitForm(e)}
                                >
                                    <div className="md:flex md:items-center mb-6">
                                        <div className="md:w-1/6">
                                            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                                Building Name
                                            </label>
                                        </div>
                                        <div className="md:w-5/6">
                                            <input
                                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                                type="text"
                                                placeholder="Building Name"
                                                value={building.name}
                                                onChange={(e) =>
                                                    setBuilding({
                                                        ...building,
                                                        name: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="md:flex md:items-center mb-6">
                                        <div className="md:w-1/6">
                                            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                                Address
                                            </label>
                                        </div>
                                        <div className="md:w-5/6">
                                            <input
                                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                                type="text"
                                                placeholder="Address"
                                                value={building.address}
                                                onChange={(e) =>
                                                    setBuilding({
                                                        ...building,
                                                        address: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="md:flex md:items-right justify-end mb-6">
                                        <div className="md:w-5/6 xl:col-span-8 rounded-sm border border-slate-200">
                                            <header className="px-5 py-4 border-b border-slate-100">
                                                <h2 className="font-semibold text-slate-800">
                                                    Rooms
                                                </h2>
                                            </header>
                                            {rooms.map((room, index) => (
                                                <div
                                                    className="px-5 py-4"
                                                    key={index}
                                                >
                                                    <div className="md:flex md:items-center mb-6">
                                                        <div className="md:w-1/3">
                                                            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                                                Name
                                                            </label>
                                                        </div>
                                                        <div className="md:w-2/3">
                                                            <input
                                                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                                                type="text"
                                                                placeholder="Name"
                                                                value={
                                                                    rooms[index]
                                                                        .name
                                                                }
                                                                onChange={(e) =>
                                                                    setRoomValue(
                                                                        e,
                                                                        index,
                                                                        'name'
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="md:flex md:items-center mb-6">
                                                        <div className="md:w-1/3">
                                                            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                                                Description
                                                            </label>
                                                        </div>
                                                        <div className="md:w-2/3">
                                                            <textarea
                                                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                                                type="text"
                                                                placeholder="Description"
                                                                value={
                                                                    rooms[index]
                                                                        .description
                                                                }
                                                                onChange={(e) =>
                                                                    setRoomValue(
                                                                        e,
                                                                        index,
                                                                        'description'
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="md:flex md:items-center mb-6">
                                                        <div className="md:w-1/3">
                                                            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                                                Area
                                                            </label>
                                                        </div>
                                                        <div className="md:w-2/3">
                                                            <input
                                                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                                                type="number"
                                                                placeholder="Area (sq.)"
                                                                value={
                                                                    rooms[index]
                                                                        .area
                                                                }
                                                                onChange={(e) =>
                                                                    setRoomValue(
                                                                        e,
                                                                        index,
                                                                        'area'
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="md:flex md:items-center mb-6">
                                                        <button
                                                            className="btn bg-red-500 hover:bg-red-600 text-white mx-3 my-3"
                                                            type="button"
                                                            onClick={() => {
                                                                setRooms(
                                                                    rooms.filter(
                                                                        (
                                                                            r,
                                                                            i
                                                                        ) =>
                                                                            i !==
                                                                            index
                                                                    )
                                                                );
                                                            }}
                                                        >
                                                            Remove Room
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                className="btn bg-blue-500 hover:bg-blue-600 text-white mx-3 my-3"
                                                type="button"
                                                onClick={() =>
                                                    setRooms([
                                                        ...rooms,
                                                        roomInterface,
                                                    ])
                                                }
                                            >
                                                <span>Add Room</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="md:flex md:items-center justify-end mb-6">
                                        <div className="">
                                            <button
                                                className="btn bg-green-500 hover:bg-green-600 text-white"
                                                type="submit"
                                            >
                                                <span>Create building</span>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {alert ? (
                <AlertComponent type={alert.type} message={alert.message} />
            ) : null}
        </div>
    );
}

export default AddBuilding;
