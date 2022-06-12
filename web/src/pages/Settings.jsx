import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AlertComponent from '../partials/alert/alert';
import Header from '../partials/Header';
import UserService from '../services/user.service';

function Settings() {
    const [alert, setAlert] = useState(false);
    const [user, setUser] = useState();

    let { id } = useParams();

    useEffect(() => {
        if (id) {
            if (JSON.parse(localStorage.getItem('token')).user.role != 1) {
                window.location.href = '/';
            }
            UserService.getUser(id).then((res) => {
                setUser(res.data);
            });
        } else {
            setUser(UserService.getUserInformationFromStorage());
        }
        
    }, []);

    const submitForm = (e) => {
        e.preventDefault();

        if (!user.email)
            return setAlert({
                type: 'danger',
                message: 'Email is required',
            });
        if (!user.first_name)
            return setAlert({
                type: 'danger',
                message: 'First name is required',
            });

        if (!user.last_name)
            return setAlert({
                type: 'danger',
                message: 'Last name is required',
            });

        if (!user.phone)
            return setAlert({
                type: 'danger',
                message: 'Phone is required',
            });

        UserService.update(user).then((res) => {
            if (res.data) {
                setAlert({
                    type: 'success',
                    message: 'User settings updated successfully',
                });
                if (id) {
                    return;
                }
                let previousToken = JSON.parse(localStorage.getItem('token'));

                UserService.getUser(user.id).then((res) => {
                    previousToken.user = res.data;
                    localStorage.setItem(
                        'token',
                        JSON.stringify(previousToken)
                    );
                });
                return;
            }
            setAlert({
                type: 'danger',
                message: 'An error occurred while updating your user settings',
            });
            return;
        });
    };

    return (
        <div className="flex h-screen overflow-hidden">

            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {/*  Site header */}
                <Header />

                <main>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-slate-200">
                            <header className="px-5 py-4 border-b border-slate-100">
                                <h2 className="font-semibold text-slate-800">
                                    Settings
                                </h2>
                            </header>
                            {user ? (
                                <div className="px-5 py-4">
                                    <form
                                        className="w-full"
                                        onSubmit={(e) => submitForm(e)}
                                    >
                                        <div className="md:flex md:items-center mb-6">
                                            <div className="md:flex md:items-center md:w-1/2">
                                                <div className="md:w-2/6">
                                                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                                        First Name
                                                    </label>
                                                </div>
                                                <div className="md:w-4/6">
                                                    <input
                                                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                                        type="text"
                                                        placeholder="Fist Name"
                                                        value={user.first_name || ''}
                                                        onChange={(e) =>
                                                            setUser({
                                                                ...user,
                                                                first_name:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:flex md:items-center md:w-1/2">
                                                <div className="md:w-2/6">
                                                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                                        Last Name
                                                    </label>
                                                </div>
                                                <div className="md:w-4/6">
                                                    <input
                                                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                                        type="text"
                                                        placeholder="Last Name"
                                                        value={user.last_name || ''}
                                                        onChange={(e) =>
                                                            setUser({
                                                                ...user,
                                                                last_name:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:flex md:items-center mb-6">
                                            <div className="md:flex md:items-center md:w-1/2">
                                                <div className="md:w-2/6">
                                                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                                        Phone Number
                                                    </label>
                                                </div>
                                                <div className="md:w-4/6">
                                                    <input
                                                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                                        type="text"
                                                        placeholder="Phone Number"
                                                        value={user.phone || ''}
                                                        onChange={(e) =>
                                                            setUser({
                                                                ...user,
                                                                phone: e.target
                                                                    .value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:flex md:items-center md:w-1/2">
                                                <div className="md:w-2/6">
                                                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                                        Email
                                                    </label>
                                                </div>
                                                <div className="md:w-4/6">
                                                    <input
                                                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                                        type="text"
                                                        placeholder="Last Name"
                                                        value={user.email || ''}
                                                        onChange={(e) =>
                                                            setUser({
                                                                ...user,
                                                                email: e.target
                                                                    .value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {user.role === 1 || id ? (
                                            <>
                                                <div className="md:flex md-items-center mb-6">
                                                    <div className="md:flex md:items-center md:w-1/3">
                                                        <div className="md:w-2/6">
                                                            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                                                Pcr Result
                                                            </label>
                                                        </div>
                                                        <div className="md:w-4/6">
                                                            <label
                                                                htmlFor="default-toggle"
                                                                className="inline-flex relative items-center cursor-pointer"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    value={user.pcr_result || false}
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        setUser(
                                                                            {
                                                                                ...user,
                                                                                pcr_result:
                                                                                    !user.pcr_result,
                                                                            }
                                                                        );
                                                                    }}
                                                                    checked={
                                                                        user.pcr_result
                                                                    }
                                                                    id="default-toggle"
                                                                    className="sr-only peer"
                                                                />
                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                                    {user.pcr_result
                                                                        ? 'Positive'
                                                                        : 'Negative'}
                                                                </span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="md:flex md:items-center md:w-1/3">
                                                        <div className="md:w-2/6">
                                                            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                                                Vaccination Dose
                                                            </label>
                                                        </div>
                                                        <div className="md:w-4/6">
                                                            <input
                                                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                                                type="number"
                                                                value={user.vac_dose || 0}
                                                                onChange={(e) =>
                                                                    setUser({
                                                                        ...user,
                                                                        vac_dose:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    })
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="md:flex md:items-center md:w-1/3">
                                                        <div className="md:w-2/6">
                                                            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                                                Had Covid
                                                            </label>
                                                        </div>
                                                        <div className="md:w-4/6">
                                                            <input
                                                                className=""
                                                                type="checkbox"
                                                                value={true}
                                                                checked={user.had_covid || false}
                                                                onChange={(e) =>
                                                                    setUser({
                                                                        ...user,
                                                                        had_covid:
                                                                            !user.had_covid,
                                                                    })
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="md:flex md-items-center mb-6">
                                                    <div className="md:flex md:items-center md:w-1/2">
                                                        <div className="md:w-2/6">
                                                            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                                                Age
                                                            </label>
                                                        </div>
                                                        <div className="md:w-4/6">
                                                            <input
                                                                className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                                                                type="text"
                                                                placeholder="Age"
                                                                value={user.age || ''}
                                                                onChange={(e) =>
                                                                    setUser({
                                                                        ...user,
                                                                        age: e
                                                                            .target
                                                                            .value,
                                                                    })
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="md:flex md:items-center md:w-1/2">
                                                        <div className="md:w-2/6">
                                                            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                                                                Role
                                                            </label>
                                                        </div>
                                                        <div className="md:w-4/6">
                                                            <select
                                                                value={user.role || 3}
                                                                onChange={(e) =>
                                                                    setUser({
                                                                        ...user,
                                                                        role: e
                                                                            .target
                                                                            .value,
                                                                    })
                                                                }
                                                            >
                                                                <option value="1">General Admin</option>
                                                                <option value="2">Building Admin</option>
                                                                <option value="3">Guest</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}
                                        <div className="md:flex md:items-center justify-end mb-6">
                                            <div className="">
                                                <button
                                                    className="btn bg-green-500 hover:bg-green-600 text-white"
                                                    type="submit"
                                                >
                                                    <span>Update</span>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            ) : null}
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

export default Settings;
