// -------------------------------------------------------------
// time-app-jsx
// -------------------------------------------------------------

import { css, styled } from 'uebersicht';

export const refreshFrequency = 1000; // time in ms

const timeZones = [
    { city: 'Honolulu', tz: 'Pacific/Honolulu' },
    { city: 'San Francisco', tz: 'America/Los_Angeles' },
    { city: 'Austin', tz: 'America/Chicago' },
    { city: 'New York', tz: 'America/New_York' },
    { city: 'Kuwait', tz: 'Asia/Kuwait' },
    { city: 'UTC', tz: 'Etc/GMT', options: { hour12: false } }
];

// -------------------------------------------------------------
// command
// -------------------------------------------------------------

export const command = (dispatch) => {
    const date = new Date();

    const locations = timeZones.map((location) => {
        location.time = date.toLocaleTimeString('en-US', {
            ...location.options,
            hour: '2-digit',
            minute: '2-digit',
            timeZone: location.tz
        });
        return location;
    });

    dispatch({ type: 'TIME_UPDATE', data: locations });
};

// -------------------------------------------------------------
// state
// -------------------------------------------------------------

export const initialState = { locations: [] };

export const updateState = (event, previousState) => {
    switch (event.type) {
        case 'TIME_UPDATE': {
            return { locations: event.data };
        }
        default: {
            return previousState;
        }
    }
};

// -------------------------------------------------------------
// styles
// -------------------------------------------------------------

export const className = css`
    bottom: 15px;
    right: 20px;
    font-family: 'Helvetica Neue', sans-serif;
`;

export const Widget = styled('div')`
    display: flex;
`;

export const Location = styled('div')`
    display: flex;
    flex-direction: column;
    padding-right: 25px;

    :last-child {
        padding-right: 0px;
    }
`;

export const City = styled('div')`
    color: #ffffff99;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.5px;
    padding-right: 15px;
    padding-bottom: 2px;
`;

export const Time = styled('div')`
    color: #ffffff;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 1px;
`;

// -------------------------------------------------------------
// render
// -------------------------------------------------------------

export const render = ({ locations, error }) => {
    return (
        <Widget>
            {locations.map((location) => (
                <Location key={location.city}>
                    <City>{location.city}</City>
                    <Time>{location.time}</Time>
                </Location>
            ))}
        </Widget>
    );
};
