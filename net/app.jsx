// -------------------------------------------------------------
// net-app-jsx
// -------------------------------------------------------------

import { css, styled } from 'uebersicht';

export const refreshFrequency = 1000 * 60 * 5; // time in ms

// -------------------------------------------------------------
// command
// -------------------------------------------------------------

export const command = 'net/cmd.sh';

// -------------------------------------------------------------
// styles
// -------------------------------------------------------------

export const className = css`
    top: 15px;
    left: 20px;
    font-family: 'Helvetica Neue', sans-serif;
`;

const Widget = styled('div')`
    display: flex;
    flex-direction: column;
`;

const Set = styled('div')`
    display: flex;
    align-items: center;
    padding-bottom: 3px;
`;

const Label = styled('div')`
    color: #ffffff99;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.5px;
    width: 35px;
`;

const Change = styled('div')`
    color: #ffffff;
    font-size: 12px;
    font-weight: 400;
    font-family: 'Courier', sans-serif;
`;

const Partial = styled('div')`
    display: flex;
    flex-direction: column;
`;

// -------------------------------------------------------------
// render
// -------------------------------------------------------------

export const render = ({ output }) => {
    if (!output) {
        return (
            <Widget>
                <Set>
                    <Label>en0</Label>
                    <Change>-</Change>
                </Set>
                <Set>
                    <Label>pub</Label>
                    <Change>-</Change>
                </Set>
            </Widget>
        );
    }

    const data = JSON.parse(output);

    return (
        <Widget>
            <Set>
                <Label>en0</Label>
                <Change>{data.en0}</Change>
            </Set>
            <Set>
                <Label>pub</Label>
                <Change>{data.pub0}</Change>
            </Set>
            {data.vpn0 != 'Unknown' && (
                <Partial>
                    <Set>
                        <Label>vpn</Label>
                        <Change>{data.vpn0}</Change>
                    </Set>
                    <Set>
                        <Label>loc</Label>
                        <Change>{data.vpnregion}</Change>
                    </Set>
                </Partial>
            )}
        </Widget>
    );
};
