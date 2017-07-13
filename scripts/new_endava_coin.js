'use strict';

// Copyright 2017 Eoin Woods
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


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