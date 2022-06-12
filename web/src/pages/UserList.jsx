import React, { useState, useEffect } from 'react';

import Header from '../partials/Header';
import UserService from '../services/user.service';
import { Link } from 'react-router-dom';
export default function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        UserService.getList().then((res) => {
            setUsers(res.data.users);
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
                        <div className="grid gap-6">
                            <div className="col-span-full xl:col-span-8 bg-white shadow-lg rounded-sm border border-slate-200">
                                <header className="px-5 py-4 border-b border-slate-100">
                                    <h2 className="font-semibold text-slate-800">
                                        Buildings
                                    </h2>
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
                                                            Full Name
                                                        </div>
                                                    </th>
                                                    <th className="p-2">
                                                        <div className="font-semibold text-left">
                                                            Email
                                                        </div>
                                                    </th>
                                                    <th className="p-2">
                                                        <div
                                                            className="font-semibold text-center"
                                                            title="Occupancy / Capacity"
                                                        >
                                                            PCR Result
                                                        </div>
                                                    </th>
                                                    <th className="p-2">
                                                        <div className="font-semibold text-center">
                                                            Had Covid
                                                        </div>
                                                    </th>
                                                    <th className="p-2">
                                                        <div className="font-semibold text-center">
                                                            Vac. Dose
                                                        </div>
                                                    </th>
                                                    <th className="p-2">
                                                        <div className="text-center font-semibold">
                                                            Details
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            {/* Table body */}
                                            <tbody className="text-sm font-medium divide-y divide-slate-100">
                                                {users.map((user) => (
                                                    <tr key={user.id}>
                                                        <td className="p-2">
                                                            <div className="text-left text-slate-600 text-sm font-semibold">
                                                                <span className="font-semibold text-slate-500">
                                                                    {
                                                                        user.first_name
                                                                    }{' '}
                                                                    {
                                                                        user.last_name
                                                                    }
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-2">
                                                            <div className="text-left text-sm ">
                                                                <span className="">
                                                                    {user.email}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-2">
                                                            <div className="text-center text-sm ">
                                                                <span className="">
                                                                    {user.pcr_result
                                                                        ? pcr_result
                                                                        : 'Empty'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-2">
                                                            <div className="text-center text-sm ">
                                                                <span className="">
                                                                    {user.had_covid
                                                                        ? 'Yes'
                                                                        : 'No'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-2">
                                                            <div className="text-center text-sm ">
                                                                <span className="">
                                                                    {user.vac_dose ??
                                                                        0}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="p-2">
                                                            <div className="text-right flex justify-center">
                                                                <Link to={`/settings/${user.id}`}>
                                                                    <span className="text-sm font-semibold text-blue-500 mb-1 inline-flex items-center hover:text-blue-600 active:text-blue-500">
                                                                        Details
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                                        </svg>
                                                                    </span>
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
