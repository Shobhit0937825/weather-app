import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WeatherApp from './WeatherApp';

jest.mock('../assets/images/sunny.png', () => 'sunny.png');
jest.mock('../assets/images/cloudy.png', () => 'cloudy.png');
jest.mock('../assets/images/rainy.png', () => 'rainy.png');
jest.mock('../assets/images/snowy.png', () => 'snowy.png');
jest.mock('../assets/images/loading.gif', () => 'loading.gif');

describe('WeatherApp', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('renders initial weather information for default location', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        name: 'Gurgaon',
        weather: [{ main: 'Clear' }],
        main: { temp: 30, humidity: 50 },
        wind: { speed: 10 },
      })
    );

    render(<WeatherApp />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Gurgaon')).toBeInTheDocument());
    expect(screen.getByText('Clear')).toBeInTheDocument();
    expect(screen.getByText('30°')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('10 km/h')).toBeInTheDocument();
  });

  test('allows user to search for a location', async () => {
    fetch.mockResponseOnce(
      JSON.stringify({
        name: 'New York',
        weather: [{ main: 'Clouds' }],
        main: { temp: 20, humidity: 60 },
        wind: { speed: 15 },
      })
    );

    render(<WeatherApp />);

    fireEvent.change(screen.getByPlaceholderText('Enter Location'), {
      target: { value: 'New York' },
    });

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('New York')).toBeInTheDocument());
    expect(screen.getByText('Clouds')).toBeInTheDocument();
    expect(screen.getByText('20°')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('15 km/h')).toBeInTheDocument();
  });

  test('displays not found message for invalid location', async () => {
    fetch.mockResponseOnce(JSON.stringify({ cod: '404', message: 'city not found' }));

    render(<WeatherApp />);

    fireEvent.change(screen.getByPlaceholderText('Enter Location'), {
      target: { value: 'InvalidCity' },
    });

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Not Found')).toBeInTheDocument());
  });
});