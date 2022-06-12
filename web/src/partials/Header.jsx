import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import UserMenu from './header/UserMenu';

function Header() {
    const { pathname } = location;
    return (
        <header
            id="header"
            className="sticky top-0 bg-white border-b border-slate-200 z-30"
        >
            <div className="px-4 sm:px-6 lg:px-8 max-w-9xl mx-auto">
                <div className="flex items-center justify-between -mb-px h-12 sm:h-14">
                    {/* Header Content */}
                    <div>
                    {/* Logo */}
                    <NavLink end to="/" className="inline-flex items-center h-12 sm:h-14">
                        <img
                            src="/src/images/icon.png"
                            className="w-auto h-9 sm:h-10"
                        />
                        <span className='hidden sm:inline-block ml-1 text-xs font-medium text-slate-700'>Covid Safe Building</span>
                    </NavLink>
                    </div>
                    <div className='flex overflow-x-auto'>
                        {/* Dashboard */}
                        <NavLink end to="/">
                            <button className={`border-b-2 ${pathname === '/' ? 'border-blue-500' : 'border-slate-300 hover:border-blue-400 group'} flex items-center px-2 sm:px-4 h-12 sm:h-14`}>
                                <svg className="hidden sm:inline-block shrink-0 h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        className={`fill-current ${pathname === '/' ? 'text-blue-500' : 'text-slate-400 group-hover:text-blue-400'}`}
                                        d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z"
                                    />
                                    <path
                                        className={`fill-current ${pathname === '/' ? 'text-blue-600' : 'text-slate-600 group-hover:text-blue-500'}`}
                                        d="M12 3c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"
                                    />
                                    <path
                                        className={`fill-current ${ pathname === '/' ? 'text-blue-200' : 'text-slate-400 group-hover:text-blue-100'}`}
                                        d="M12 15c-1.654 0-3-1.346-3-3 0-.462.113-.894.3-1.285L6 6l4.714 3.301A2.973 2.973 0 0112 9c1.654 0 3 1.346 3 3s-1.346 3-3 3z"
                                    />
                                </svg>
                                <span className={`ml-2 text-xs sm:text-sm font-medium ${pathname === '/' ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-500'}`}>
                                    Dashboard
                                </span>
                            </button>
                        </NavLink>

                        {/* Buildings */}
                        <NavLink end to="/buildings">
                            <button className={`border-b-2 ${pathname.includes('building') ? 'border-blue-500' : 'border-slate-300 hover:border-blue-400 group'} flex items-center px-2 sm:px-4 h-12 sm:h-14`}>
                                <svg
                                    className="hidden sm:inline-block shrink-0 h-5 w-5"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={`fill-current ${pathname.includes('building') ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-500'}`}
                                        d="M4 18h2a1 1 0 001-1V8a1 1 0 00-1-1H4a1 1 0 00-1 1v9a1 1 0 001 1zM11 18h2a1 1 0 001-1V3a1 1 0 00-1-1h-2a1 1 0 00-1 1v14a1 1 0 001 1zM17 12v5a1 1 0 001 1h2a1 1 0 001-1v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1z"
                                    />
                                </svg>
                                <span className={`ml-2 text-xs sm:text-sm font-medium ${pathname.includes('building') ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-500'}`}>
                                    Buildings
                                </span>
                            </button>
                        </NavLink>


                    </div>
                    
                    <UserMenu />

                </div>
            </div>
        </header>
    );
}

export default Header;
