const Divisa = artifacts.require("Divisa");

module.exports = function (deployer) {
  deployer.deploy(Divisa);
};
