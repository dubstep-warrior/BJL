# Welcome to the Team BJL Repository

This project was created for the [Singapore Blockchain Innovation Challenge Hackathon](https://sbic2021.sbip.sg/)

## Group Members:

 - Kok Bo Jin
 - Phan Vu Lan
 - Jasper Pang

## `Project Overview`

For this hackathon, our team was tasked to develop innovative protocols, frameworks, and use cases for blockchain interoperability, the only requirement was that we needed to have at least 2 different blockchains in our project.

### `The Problem`

A user holding Token A on Blockchain A is unable to pay for services on Blockchain B using Token A. Due to different token protocols, it is difficult for a user to transfer Token A to Blockchain B.

Currently, a user has to purchase a blockchain’s native currency or currencies that use the same protocol as the blockchain to purchase decentralized app services on the same blockchain.


### `Our Solution`

A cross-chain bridge application that allows transfer of tokens between Ethereum and Binance Smartchain(for now).

With smart contracts on both the Ethereum Network and the Binance Smartchain, alongside a user interface in React, users will be able to transfer their tokens from one network to the other.

The Web3JS API will also be used for various functionalities and reasons, mainly convenience.

### `Features`

Full control of the exchange, you can host the exchange and do it yourself or have someone you trust with the ability to do so to host it for you.

Conservation of value in the ecosystem.
 - The number of minted wrapped tokens in circulation is always equal to the amount of native token locked up.

### `Possible Use-Cases`

Cross-chain transfer of assets.
 - Users will be able to transfer crypto assets between blockchains and have access to purchasing services across different blockchains.
 - While our solution only supports transactions between Ethereum and Binance Smartchain, this can be easily extendable to other blockchains such as Solana.

Cross-chain payment.
 - Developers building decentralized applications will be able to make use of our solution to conduct cross-chain transactions, expanding their user base to other blockchains. Abstracting the conversion process from the user, the user only has to click the purchase button in the decentralized application.
