import * as React from 'react';
import renderer from 'react-test-renderer';

import BuildingChart from '../../src/partials/dashboard/BuildingChart';

it('renders correctly', async () => {
    let container = document.createElement('div');

    renderer.act(() => {
        renderer.create(
            <BuildingChart
                building={[
                    {
                        id: 1,
                        name: 'Building 1',
                        rooms: [
                            {
                                id: 1,
                                name: 'Room 1',
                                capacity: 100,
                                occupancy: 50,
                                labels: [
                                    'Jan',
                                    'Feb',
                                    'Mar',
                                    'Apr',
                                    'May',
                                    'Jun',
                                    'Jul',
                                    'Aug',
                                    'Sep',
                                    'Oct',
                                    'Nov',
                                    'Dec',
                                ],
                                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                            },
                            {
                                id: 2,
                                name: 'Room 2',
                                capacity: 100,
                                occupancy: 50,
                                labels: [
                                    'Jan',
                                    'Feb',
                                    'Mar',
                                    'Apr',
                                    'May',
                                    'Jun',
                                    'Jul',
                                    'Aug',
                                    'Sep',
                                    'Oct',
                                    'Nov',
                                    'Dec',
                                ],
                                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                            },
                        ],
                        labels: [
                            'Jan',
                            'Feb',
                            'Mar',
                            'Apr',
                            'May',
                            'Jun',
                            'Jul',
                            'Aug',
                            'Sep',
                            'Oct',
                            'Nov',
                            'Dec',
                        ],
                        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                    },
                ]}
                occupancy={0}
            />,

            container
        );
    });

    expect(container).toMatchSnapshot('Rendered');
});
