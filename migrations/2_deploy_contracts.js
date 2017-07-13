var SpaCoin = artifacts.require("./endavacoin.sol");


module.exports = function(deployer) {
  deployer.deploy(EndavaCoin, {gas: 800000});
};
