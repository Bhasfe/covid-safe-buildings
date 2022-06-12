import { Tooltip } from 'flowbite-react';
import React from 'react';
/**
 * Display the occupancy and capacity of the building with colors according to the occupancy
 *
 * @param {num} capacity Overall capacity of the building
 * @param {num} occupancy Overall occupant count of the building
 */
 function Occupancy({ capacity, occupancy, area = 0, output_type = 'default' }) {
    // Calculate occupancy percentage
    let occupancy_percentage = (occupancy / capacity) * 100;

    let levels = {
        'safe': {
            color: 'text-green-600',
        },
        'warning': {
            color: 'text-orange-600',
        },
        'danger': {
            color: 'text-red-600',
        }
    }

    let level = 'safe';

    if (occupancy_percentage >= 75) {
        level = 'danger';
    } else if (occupancy_percentage >= 50) {
        level = 'warning';
    }


    if (output_type === 'table') {
        return (
            <td className="p-2">
                <div className="text-center text-sm font-semibold">
                    <span className={`font-semibold ${levels[level].color}`}>
                        {occupancy}
                    </span>
                    <span> / </span>
                    <span className="font-semibold text-slate-600">
                        {capacity}
                    </span>
                </div>
            </td>
        );
    }

    return (
        <div className="text-center text-sm font-semibold inline-flex items-center">
            <span className={`font-semibold ${levels[level].color}`}>{occupancy}</span>
            <span className='mx-0.5'> / </span>
            <span className="font-semibold text-slate-600">{capacity}</span>
            {area > 0 &&
            <div className='inline-block ml-1'>
                <Tooltip className='inline-flex items-center' content={(<p className='text-left text-xs'>Has area of <b className='text-sm'>{area}<span className='ml-px'>m²</span></b><br/>1 person per <b>4<span className='ml-px'>m²</span></b></p>)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" style={{lineHeight: 0}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </Tooltip>
            </div>
            }
        </div>
    );
                    
}

export default Occupancy;