Ethereum Example Token
=======================

The code in this directory is the simple [Solidity](solidity.readthedocs.io) contract, 
within a [Truffle](truffleframework.com) project.

If you have Truffle and a suitable Ethereum node available (start with [testrpc](https://github.com/ethereumjs/testrpc) if in doubt) then you can run:

	$ truffle compile
	$ truffle test
	$ truffle migrate

The `truffle.js` file defines the Ethereum networks that Truffle can deploy to.  The one
named "development" is the default, use `--network` to specify one of the others (updating the file
if needed to identify the node you'll be using for each network you want to use).

In the `scripts` directory you will also find plain JavaScript files for deploying, creating instances of and calling the contract, which can be useful if you want to deploy and use the contracts without needing Truffle.
