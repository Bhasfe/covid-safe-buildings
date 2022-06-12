import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../partials/Header';

import AlertComponent from '../partials/alert/alert';
import CameraService from '../services/camera.service';
import RoomService from '../services/room.service';

import PeopleStatus from '../partials/components/PeopleStatus';

function AddCamera(props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [alert, setAlert] = useState(null);

    let { building_id, room_id, camera_id } = useParams();
    const [camera, setCamera] = useState({
        ip_address: '',
    });

    const [room, setRoom] = useState({});

    useEffect(() => {
        if (camera_id) {
            CameraService.get(building_id, room_id, camera_id).then((res) => {
                setCamera(res.data);
            });
            RoomService.get(building_id, room_id).then((res) => {
                setRoom(res.data);
            });
        }
    }, [setCamera, setRoom]);

    const submitForm = (e) => {
        e.preventDefault();
        if (camera_id) {
            CameraService.update(building_id, room_id, camera_id, camera).then(
                (res) => {
                    if (res.data.id) {
                        setAlert({
                            type: 'success',
                            message: 'Camera updated successfully',
                        });
                        return;
                    }
                    setAlert({
                        type: 'error',
                        message: 'Something went wrong',
                    });
                }
            );
        } else {
            CameraService.add(building_id, room_id, camera).then((res) => {
                if (res.data.id) {
                    setAlert({
                        type: 'success',
                        message: 'Camera added successfully',
                    });
                    window.location.href = `/building/${res.data.building_id}/room/${res.data.room_id}/camera/${res.data.id}`;
                }
                setAlert({
                    type: 'error',
                    message: 'Something went wrong',
                });
            });
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/*  Site header */}
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                <main>
                    {camera_id ? (
                        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                            <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-slate-200">
                                <div className="px-5 py-5 mx-5 my-5 rounded-md absolute bg-white/70">
                                    <PeopleStatus
                                        people={room}
                                        polling={true}
                                    />
                                </div>
                                <iframe
                                    src={`${process.env.LIVE_STREAM_URL}building/1/room/1/camera/2/live_stream_raw`}
                                    className="w-full h-screen"
                                ></iframe>
                            </div>
                        </div>
                    ) : null}
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-slate-200">
                            <header className="px-5 py-4 border-b border-slate-100">
                                <h2 className="font-semibold text-slate-800">
                                    {camera_id ? 'Update ' : 'Add '} Camera
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
                                                IP Adress
                                            </label>
                                        </div>
                                        <div className="md:w-5/6">
                                            <input
                                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                                type="text"
                                                placeholder="0.0.0.0"
                                                value={camera.ip_address}
                                                onChange={(e) =>
                                                    setCamera({
                                                        ip_address:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="md:flex md:items-center justify-end mb-6">
                                        <div className="">
                                            <button
                                                className="btn bg-green-500 hover:bg-green-600 text-white"
                                                type="submit"
                                            >
                                                <span>
                                                    {camera_id
                                                        ? 'Update '
                                                        : 'Add '}
                                                    Camera
                                                </span>
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

export default AddCamera;
