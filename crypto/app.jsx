// -------------------------------------------------------------
// crypto-app-jsx
// -------------------------------------------------------------

import { css, styled } from 'uebersicht';

export const refreshFrequency = 1000 * 60 * 15; // time in ms

const coinAPI = {
    url: 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest',
    key: 'API-KEY',
    currency: 'USD'
};

const uberProxy = 'http://127.0.01:41417';

const coinList = [
    { symbol: 'BTC', isActive: true },
    { symbol: 'ETH', isActive: true },
    { symbol: 'SOL', isActive: true },
    { symbol: 'ADA', isActive: true },
    { symbol: 'DOT', isActive: true }
];

const coinUrl = `${coinAPI.url}?convert=${coinAPI.currency}&symbol=${coinList.map(
    (coin) => coin.symbol
)}`;

// -------------------------------------------------------------
// command
// -------------------------------------------------------------

export const command = (dispatch) => {
    fetch(`${uberProxy}/${coinUrl}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'X-CMC_PRO_API_KEY': coinAPI.key
        }
    })
        .then((response) =>
            response.json().then((json) => {
                dispatch({ type: 'FETCH_SUCCEDED', data: json.data });
            })
        )
        .catch((error) => {
            dispatch({ type: 'FETCH_FAILED', error: error });
        });
};

// -------------------------------------------------------------
// state
// -------------------------------------------------------------

export const initialState = { coins: [] };

export const updateState = (event, previousState) => {
    switch (event.type) {
        case 'FETCH_SUCCEDED': {
            const data = coinList.map((coin) => {
                coin.quote = event.data[coin.symbol][0].quote[coinAPI.currency];
                return coin;
            });
            return { coins: data };
        }
        case 'FETCH_FAILED': {
            const data = coinList.map((coin) => {
                coin.quote = {
                    percent_change_1h: 0,
                    percent_change_24h: 0,
                    price: 0
                };
                return coin;
            });
            return { coins: data, error: event.error };
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
    left: 20px;
    font-family: 'Helvetica Neue', sans-serif;
`;

const Widget = styled('div')`
    display: flex;
`;

const Coin = styled('div')((props) => ({
    display: props.status ? 'flex' : 'none',
    flexDirection: 'column',
    paddingRight: '25px',
    ':last-child': {
        paddingRight: '0px'
    }
}));

const SymbolTop = styled('div')`
    color: #ffffff;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.5px;
    padding-right: 15px;
    padding-bottom: 2px;
    padding-top: 2px;
`;

const SymbolBottom = styled('div')`
    color: #ffffff99;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.5px;
    padding-right: 15px;
    padding-bottom: 2px;
    padding-top: 2px;
`;

const Price = styled('div')`
    color: #ffffff;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 1px;
`;

const Change = styled('div')`
    color: #ffffff99;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0px;
    padding-right: 15px;
    font-family: 'Courier', sans-serif;
`;

const Spacer = styled('div')`
    height: 12px;
`;

// -------------------------------------------------------------
// render
// -------------------------------------------------------------

export const render = ({ coins, error }) => {
    return (
        <Widget>
            {coins.map((coin) => (
                <Coin key={coin.symbol} status={coin.isActive}>
                    <SymbolTop>{coin.symbol}</SymbolTop>
                    <Change>
                        {coin.quote.percent_change_1h > 0 && '\u202F'}
                        {coin.quote.percent_change_1h.toFixed(2)} 1h
                    </Change>
                    <Change>
                        {coin.quote.percent_change_24h > 0 && '\u202F'}
                        {coin.quote.percent_change_24h.toFixed(2)} 24h
                    </Change>
                    <Spacer />
                    <SymbolBottom>{coin.symbol}</SymbolBottom>
                    <Price>{coin.quote.price.toFixed(2)}</Price>
                </Coin>
            ))}
        </Widget>
    );
};
