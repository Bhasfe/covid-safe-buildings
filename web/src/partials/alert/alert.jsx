/**
 * create an alert component
 */
import React from 'react';

function AlertComponent(props) {
    const classes = [
        {
            type: 'success',
            class: 'text-green-700 bg-green-100 border-green-400 text-green-700',
        },
        {
            type: 'danger',
            class: 'text-red-700 bg-red-100 border-red-400 text-red-700',
        },
    ];

    const getClasses = (type) => {
        const class_obj = classes.find((c) => c.type === type);
        return class_obj.class;
    };
    return (
        <div className="absolute right-8 bottom-10 z-50">
            <div
                className={`flex p-4 mb-4 ${getClasses(props.type)}`}
                role="alert"
                id="alert-1"
            >
                <div>{props.message}</div>
            </div>
        </div>
    );
}

export default AlertComponent;
