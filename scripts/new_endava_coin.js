'use strict';

// This is a Truffle specific JavaScript script that can be used to create a new
// instance of a previously deployed contract (EndavaCoin in this case).
// It calls the unallocatedCoins() method after creation to check that the new
// instance is working.

var EndavaCoin = artifacts.require("EndavaCoin");

module.exports = function(exitCallback) {
	var coin ;

	SpaCoin.new().then(function(instance){
		coin = instance ;
		console.log("New EndavaCoin contract address is " + coin.address) ;
		return coin.unallocatedCoins.call() ;
	}).then(function(result) {
		console.log("Network has " + result.toNumber() + " coins outstanding") ;
	});

	exitCallback() ;
}