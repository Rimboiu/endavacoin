pragma solidity ^0.4.0;

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


contract EndavaCoin {
    int64 constant TOTAL_UNITS = 10000000 ;
    int64 outstanding_coins ;
    address owner ;
    mapping (address => int64) holdings ;
    
    function EndavaCoin() payable {
        outstanding_coins = TOTAL_UNITS ;
        owner = msg.sender ;
    }
    
    event CoinAllocation(address holder, int64 number, int64 remaining) ;
    event CoinMovement(address from, address to, int64 v) ;
    event InvalidCoinUsage(string reason) ;

    function getOwner()  constant returns(address) {
        return owner ;
    }

    function allocate(address newHolder, int64 value) {
        if (msg.sender != owner) {
            InvalidCoinUsage('Only owner can allocate coins') ;
            return ;
        }
        if (value < 0) {
            InvalidCoinUsage('Cannot allocate negative value') ;
            return ;
        }

        if (value <= outstanding_coins) {
            holdings[newHolder] += value ;
            outstanding_coins -= value ;
            CoinAllocation(newHolder, value, outstanding_coins) ;
        } else {
            InvalidCoinUsage('value to allocate larger than outstanding coins') ;
        }
    }
    
    function move(address destination, int64 value)  {
        address source = msg.sender ;
        if (value <= 0) {
            InvalidCoinUsage('Must move value greater than zero') ;
            return ;
        }
        if (holdings[source] >= value) {
            holdings[destination] += value ;
            holdings[source] -= value ;
            CoinMovement(source, destination, value) ;
        } else {
            InvalidCoinUsage('value to move larger than holdings') ;
        }
    }
    
    function myBalance() constant returns(int64) {
        return holdings[msg.sender] ;
    }
    
    function holderBalance(address holder) constant returns(int64) {
        if (msg.sender != owner) {
            InvalidCoinUsage("Only owner may request other holder balance") ;
            return ;
        }
        return holdings[holder] ;
    }

    function unallocatedCoins() constant returns(int64) {
        if (msg.sender != owner) {
            InvalidCoinUsage("Only owner may request unallocated coins count") ;
            return ;
        }
        return outstanding_coins ;
    }
    
}

