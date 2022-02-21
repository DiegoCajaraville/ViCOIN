// const ViCOINSale = artifacts.require("ViCOINSale");

// module.exports = function (deployer) {
//   deployer.deploy(ViCOINSale);
// };
//Usar version de arriba en caso de querer solo hacer el test de ViCOINSale

var ViCOINSale = artifacts.require("./ViCOINSale.sol");
var Tarifas = artifacts.require("./Tarifas.sol");

module.exports = (deployer, network) => {
  deployer.deploy(ViCOINSale).then(function () {
    return deployer.deploy(Tarifas, ViCOINSale.address);
  });
};