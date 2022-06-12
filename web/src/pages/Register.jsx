import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserService from '../services/user.service';

function Register() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Content area */}
            <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <main>
                    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                        <div className="mx-auto text-center mb-8">
                            <p className="text-black text-xl font-medium">
                                Create an account
                            </p>
                            <p>or login</p>
                        </div>

                        <div className="w-full max-w-xs mx-auto">
                            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                <div className="mb-4">
                                    <label
                                        className="block text-slate-700 text-sm font-medium mb-2"
                                        htmlFor="email"
                                    >
                                        Email
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="email"
                                        type="text"
                                        placeholder="Email"
                                        onChange={(event) => {
                                            setEmail(event.target.value);
                                        }}
                                    />
                                </div>
                                <div className="mb-6">
                                    <label
                                        className="block text-slate-700 text-sm font-medium mb-2"
                                        htmlFor="password"
                                    >
                                        Password
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                        id="password"
                                        type="password"
                                        placeholder="******************"
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                    />
                                    {/* <p className="text-red-500 text-xs italic">
                  Please choose a password.
                </p> */}
                                </div>
                                <div className="flex items-center justify-between flex-col">
                                    <button
                                        className="bg-blue-500 w-full hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        type="button"
                                        onClick={() => {
                                            UserService.register(
                                                email,
                                                password
                                            ).then((resp) => {
                                                if (resp.data) {
                                                    localStorage.setItem(
                                                        'token',
                                                        JSON.stringify(
                                                            resp.data
                                                        )
                                                    );
                                                    window.location.href = '/';
                                                }
                                            });
                                        }}
                                    >
                                        Register
                                    </button>
                                    <Link
                                        to='/login'
                                        className="inline-block mt-4 align-baseline font-medium text-sm text-blue-500 hover:text-blue-800 -mb-2"
                                    >
                                        Already have an account?
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Register;
