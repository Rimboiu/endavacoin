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

var EndavaCoin = artifacts.require("EndavaCoin");

module.exports = function(exitCallback) {
	var coin ;

	// Update for your contract
	var CONTRACT_ADDR = "0x16bc4143116ecafed7168bdf4169573982da0a15" ;
	var testuser = web3.eth.accounts[1] ;

	EndavaCoin.at(CONTRACT_ADDR).then(function(instance){
		coin = instance ;
		return coin.outstandingValue.call() ;
	}).then(function(result) {
		console.log("Network has " + result.toNumber() + " coins outstanding") ;
		return coin.allocate(testuser, 1000) ;
	}).then(function(result){
		console.log("Allocation transaction hash is: " + result.tx) ;
		return coin.holderBalance.call(testuser) ;
	}).then(function(result) {
		console.log("Test user " + testuser + " has " + result.toNumber() + " coins after allocation") ;
	});

	exitCallback() ;
}