import * as React from 'react';
import renderer from 'react-test-renderer';
import SafetyLevel from '../../src/partials/components/SafetyLevel';

it('renders correctly', () => {
    const tree = renderer
        .create(<SafetyLevel safety_level="low_risk" />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders correctly with integer data', () => {
    const tree = renderer.create(<SafetyLevel safety_level={80} />).toJSON();
    expect(tree).toMatchSnapshot();
});

it('doesnt render when data is missing', () => {
    const tree = renderer.create(<SafetyLevel />).toJSON();
    expect(tree).toMatchSnapshot();
});
