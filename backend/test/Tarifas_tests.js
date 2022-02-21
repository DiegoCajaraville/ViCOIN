const Tarifas = artifacts.require("Tarifas");
const ViCOINSale = artifacts.require("ViCOINSale");
const ViCOIN = artifacts.require("ViCOIN");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

contract("Tarifas", () => {
    let catchRevert = require("./exceptions.js").catchRevert;

    before(async () => {
        this.ViCSale = await ViCOINSale.deployed();
        const addressViC = await this.ViCSale.ViCERC20();
        this.ViC = await ViCOIN.at(addressViC.toString());
        this.cuentas = await web3.eth.getAccounts();
        this.admin = this.cuentas[0];
        this.Tarifas = await Tarifas.deployed();
    });

    it("migrates deployed successfully", async () => {
      const addressViCSale = this.ViCSale.address;
      const owner = await this.ViC.owner();
      const ViCSaleOfTarifas = await this.Tarifas.ViCSale();
      const ViCOfTarifas = await this.Tarifas.ViCERC20();
      const admin1 = await this.ViCSale.admin.call();
      const admin2 = await this.Tarifas.Admin.call();
      assert.equal(addressViCSale, owner.toString());
      assert.equal(ViCSaleOfTarifas.toString(), addressViCSale);
      assert.equal(ViCOfTarifas.toString(), this.ViC.address);
      assert.equal(admin1.toString(), admin2.toString());
      assert.equal(admin1.toString(), this.admin);
    });

});