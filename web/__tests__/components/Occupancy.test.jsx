import * as React from 'react';
import renderer from 'react-test-renderer';

import Occupancy from '../../src/partials/components/Occupancy';

it('renders correctly', () => {
    const tree = renderer
        .create(<Occupancy capacity={100} occupancy={50} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('doesnt render when data is missing', () => {
    const tree = renderer.create(<Occupancy />).toJSON();
    expect(tree).toMatchSnapshot();
});
