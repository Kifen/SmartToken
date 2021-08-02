# SmartToken

This is an ERC20 token and Dapp, that implements a bonding curve for dynamic token distribution.

![bd](https://github.com/Kifen/SmartToken/blob/master/public/bonding_curve.png)

It implements a basic bonding curve where **_currentPrice = tokenSupply_**


#### Run

Clone and install dependencies

`$ git clone git@github.com:Kifen/SmartToken.git`
`$ cd SmartToken && npm i`

Create file `.env.development.local` in project root and add the following:

```
RINKEBY_URL= <Infura Rinkeby URL>
PK=<Private Key>
RESERVE_TOKEN=0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea
```

Run tests

`$ npx hardhat test`

Run Dapp - ensure Metamask is installed. Dapp supports only Metamask.

`$ npm start`

The webapp runs on `http://localhost:3000/`
