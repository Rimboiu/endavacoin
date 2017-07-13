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

contract("EndavaCoin", function(accounts) {
	it("should have at least 3 accounts", function() {
		assert(accounts.length > 2, "expecting more than two accounts") ;
	});

	it("should be initialised with 10m coins", function() {
		return EndavaCoin.deployed().then(function(instance) {
			return instance.unallocatedCoins.call() ;
		}).then(function(unallocatedCoins) {
			assert.equal(unallocatedCoins.valueOf(), 10000000, "expected 10,000,000 coins after initialisation")
		})
	});

	it("should be able to allocate coins to a user", function(){
		var user1 = accounts[0];
		var user2 = accounts[1] ;
		var coin 

		var unallocatedCoinsPost ;
		var user1BalancePost;

		return EndavaCoin.deployed().then(function(instance) {
			coin = instance ;
			return coin.allocate(user1, 20000) ;
		}).then(function() {
			return coin.unallocatedCoins.call()
		}).then(function(unallocatedCoins) {
			unallocatedCoinsPost = unallocatedCoins.toNumber() ;
			return coin.holderBalance.call(user1);
		}).then(function(u1balance) {
			user1BalancePost = u1balance.toNumber() ;

			assert.equal(20000, user1BalancePost, "incorrect balance for user1");
			assert.equal(9980000, unallocatedCoinsPost, "incorrect outstanding value");
		}) ;

	});

	it("should be able to move coins between users", function(){
		var owner = accounts[0];
		var user1 = accounts[1] ;
		var user2 = accounts[2] ;
		var coin ;

		var user1InitialBalance ;
		var user1FinalBalance ;
		var user2FinalBalance ;

		return EndavaCoin.deployed().then(function(instance) {
			coin = instance ;
			return coin.allocate(user1, 20000, {from:owner}) ;
		}).then(function() {
			return coin.holderBalance.call(user1) ;
		}).then(function(user1Balance) {
			user1InitialBalance = user1Balance.toNumber() ;
			return coin.move(user2, 10000, {from:user1});
		}).then(function(result) {
			return coin.holderBalance.call(user1) ;
		}).then(function(user1Balance) {
			user1FinalBalance = user1Balance.toNumber() ;
			return coin.holderBalance.call(user2) ;
		}).then(function(user2Balance) {
			user2FinalBalance = user2Balance.toNumber() ;

			assert.equal(20000, user1InitialBalance, "user1 has the wrong initial balance") ;
			assert.equal(10000, user1FinalBalance, "user1 has the wrong final balance") ;
			assert.equal(10000, user2FinalBalance, "user2 has the wrong final balance") ;
		}) ;

	}) ;

	it("should not allow over allocation", function(){
		var owner = accounts[0] ;
		var user1 = accounts[1] ;
		var coin ;

		var user1FinalBalance ;
		return EndavaCoin.deployed().then(function(instance) {
			coin = instance ;
			return coin.allocate(user1, 9960000, {from:owner}); // all the coins left after previous tests
		}).then(function(result){
			return coin.holderBalance.call(user1) ;
		}).then(function(result) {
			user1FinalBalance = result.toNumber() ;
			return coin.allocate(user1, 1, {from:owner}) ; // an extra coin
		}).then(function(result){
			assert.equal("InvalidCoinUsage", result.logs[0].event, "expected error for over allocation") ;
			assert.equal(9970000, user1FinalBalance, "user1 has the wrong final balance") ;
		}) ;
	}) ;

})
