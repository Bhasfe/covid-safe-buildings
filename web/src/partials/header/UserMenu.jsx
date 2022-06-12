import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Transition from '../../utils/Transition';

import UserAvatar from '../../images/user-avatar.png';

import UserService from '../../services/user.service';

function UserMenu() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);

    const trigger = useRef(null);
    const dropdown = useRef(null);

    useEffect(() => {
        if (!user) setUser(UserService.getUserInformationFromStorage());
    });

    // close on click outside
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (
                !dropdownOpen ||
                (dropdown && dropdown.current && dropdown.current.contains(target)) ||
                (trigger && trigger.current && trigger.current.contains(target))
            )
                return;
            setDropdownOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!dropdownOpen || keyCode !== 27) return;
            setDropdownOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });

    return (
        <div className="relative inline-flex">
            <button
                ref={trigger}
                className="inline-flex justify-center items-center group"
                aria-haspopup="true"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
            >
                <img
                    className="h-6 w-6 sm:h-8 sm:w-8 rounded-full"
                    src={UserAvatar}
                    alt="User"
                />
                <div className="hidden sm:flex items-center truncate">
                    <span className="truncate ml-2 text-sm font-medium group-hover:text-slate-800">
                        {user ? user.first_name : null}
                    </span>
                    <svg
                        className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
                        viewBox="0 0 12 12"
                    >
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                    </svg>
                </div>
            </button>

            <Transition
                className="origin-top-right z-10 absolute top-full right-0 min-w-44 bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden mt-1"
                show={dropdownOpen}
                enter="transition ease-out duration-200 transform"
                enterStart="opacity-0 -translate-y-2"
                enterEnd="opacity-100 translate-y-0"
                leave="transition ease-out duration-200"
                leaveStart="opacity-100"
                leaveEnd="opacity-0"
            >
                <div
                    ref={dropdown}
                    onFocus={() => setDropdownOpen(true)}
                    onBlur={() => setDropdownOpen(false)}
                >
                    <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200">
                        <div className="font-medium text-slate-800">
                            {user?.first_name} {user?.last_name}
                        </div>
                        <div className="text-xs text-slate-500 italic"></div>
                    </div>
                    <ul>
                        <li>
                            <Link
                                className="font-medium text-sm text-blue-500 hover:text-blue-600 flex items-center py-1 px-3"
                                to="/settings"
                            >
                                Settings
                            </Link>
                        </li>
                        {user?.role === 1 && (
                            <li>
                                <Link
                                    className="font-medium text-sm text-blue-500 hover:text-blue-600 flex items-center py-1 px-3"
                                    to="/users"
                                >
                                    User List
                                </Link>
                            </li>
                        )    
                        }
                        <li>
                            <div
                                className="font-medium text-sm text-blue-500 hover:text-blue-600 flex items-center py-1 px-3 cursor-pointer"
                                onClick={() => {
                                    UserService.logout();
                                    window.location.reload();
                                }}
                            >
                                Sign Out
                            </div>
                        </li>
                    </ul>
                </div>
            </Transition>
        </div>
    );
}

export default UserMenu;
