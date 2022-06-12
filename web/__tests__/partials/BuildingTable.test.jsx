import * as React from 'react';
import renderer from 'react-test-renderer';
import BuildingTable from '../../src/partials/buildings/BuildingsTable';

it('renders correctly', () => {
    const tree = renderer.create(<BuildingTable buildings={[]} />).toJSON();
    expect(tree).toMatchSnapshot();
});
