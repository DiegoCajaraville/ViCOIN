const Tarifas = artifacts.require("Tarifas");
const ViCOINSale = artifacts.require("ViCOINSale");
const ViCOIN = artifacts.require("ViCOIN");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/*
    Tests a llevar a cabo:
        * Crear un patinete
        * Comprar 5 ViCOINs con usuario
        * Comprobar patinete desactivado
        * Comprar tarifaDemo
        * Comprobar patinete usable durante un tiempo
        * Modificar coste tarifa
        * Modificar tiempo tarifa
        * Comprobar da error si se paga menos
        * Comprobar uso tarifa modificada
        * Comprobar que otro no puede usar el patinete mientras esta en uso ?¿?¿?¿?¿?¿?
*/

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
      console.log(this.ViC.address);
    });

    it("patinete0 creado correctamente", async () => {
        this.Tarifas.newPatinete('0xa53ea6ce25772b6a738be397b9629a34cce8fb97');
        this.Tarifas.newPatinete("0xa53ea6ce25772b6a738be397b9629a34cce8fb97");
        // let tiempo = await this.Tarifas.remaining(0);
        let patinetes = await this.Tarifas.totalPatinetes();
        console.log(patinetes.toNumber());
        // let dir = await this.Tarifas.Patinetes[0];
        // console.log(dir.toString());
        // assert.equal(tiempo.toNumber(),0);
    });

});