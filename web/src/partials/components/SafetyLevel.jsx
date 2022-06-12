import React from 'react';

/**
 * Safety Level Component shown with colors according to the risk
 *
 * @param {string|number} safety_level  String or integer value of safety level
 */
 function SafetyLevel({ safety_level, output_type = 'default' }) {

    let levels = {
        'low_risk': {
            color: 'text-green-500',
            label: 'Low Risk',
        },
        'low_moderate': {
            color: 'text-green-500',
            label: 'Low / Moderate Risk',
        },
        'moderate_risk': {
            color: 'text-yellow-500',
            label: 'Moderate Risk',
        },
        'moderate_high': {
            color: 'text-orange-500',
            label: 'Moderate High',
        },
        'high_risk': {
            color: 'text-red-500',
            label: 'High Risk',
        },
        'unknown': {
            color: 'text-gray-500',
            label: 'Unknown',
        },
    };

    let level = 'unknown';

    if (typeof safety_level === 'number') {

        if (safety_level >= 80) {
            level = 'low_risk';
        } else if (safety_level >= 60) {
           level = 'low_moderate';
        } else if (safety_level >= 40) {
            level = 'moderate_risk';
        } else if (safety_level >= 20) {
            level = 'moderate_high';
        } else {
            level = 'high_risk';
        }

    } else if (typeof safety_level === 'string' && Object.keys(levels).includes(safety_level)) {
        level = safety_level;
    }

    if (output_type === 'table') {
        return (
            <td className="p-2">
                <div className="text-center text-sm font-semibold">
                    <span className={`font-semibold ${levels[level].color}`}>
                        {levels[level].label}
                    </span>
                </div>
            </td>
        );
    }

    return (
        <div className={`${levels[level].color} text-lg font-semibold`}>
            {levels[level].label}
        </div>
    );

}

export default SafetyLevel;