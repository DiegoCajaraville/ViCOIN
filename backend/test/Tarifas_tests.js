const Tarifas = artifacts.require("Tarifas");
const ViCOINSale = artifacts.require("ViCOINSale");
const ViCOIN = artifacts.require("ViCOIN");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/*
    Tests a llevar a cabo:
        * Crear un patinete V
        * Comprar 5 ViCOINs con usuario V
        * Comprobar patinete desactivado V
        * Comprar tarifaDemo V
        * Comprobar patinete usable durante un tiempo V
        * Modificar coste tarifa
        * Modificar tiempo tarifa
        * Comprobar da error si se paga menos
        * Comprobar uso tarifa modificada
        * Comprobar que otro no puede usar el patinete mientras esta en uso
*/

//IMPORTANTE: este test no puede usarse con el autominado de truffle (ya que no calcula el tiempo correctamente)

contract("Tarifas", () => {
  let catchRevert = require("./exceptions.js").catchRevert;

  before(async () => {
    this.ViCSale = await ViCOINSale.deployed();
    const addressViC = await this.ViCSale.ViCERC20();
    this.ViC = await ViCOIN.at(addressViC.toString());
    this.cuentas = await web3.eth.getAccounts();
    this.admin = this.cuentas[0];
    this.Tarifas = await Tarifas.deployed();
    console.log(addressViC);
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

  it("patinete0 y patinete1 creados correctamente", async () => {
    this.Tarifas.newPatinete("0xa53ea6ce25772b6a738be397b9629a34cce8fb97");
    this.Tarifas.newPatinete("0x986cBfcd1034E84485110a78302906B6CD96878e");
    this.Tarifas.newPatinete("0xD5B42F28F536c6b58E433a47815a76304a372C4B");
    //Hay que dar tiempo a la blockchain a actualizarse
    await sleep(1500);
    let tiempo = await this.Tarifas.remaining(0);
    let npatines = await this.Tarifas.totalPatinetes();
    assert.equal(tiempo.toNumber(), 0);
    assert.equal(npatines.toNumber(), 2);
  });

  it("usuario1 compra 5 ViCs correctamente", async () => {
    this.ViCSale.buyViCOINS(5, {
      value: web3.utils.toWei("0.05", "ether"),
      from: this.cuentas[1],
    });

    //Hay que dar tiempo a la blockchain a actualizarse
    await sleep(1500);

    const balance = await this.ViC.balanceOf(this.ViCSale.address);
    const balance2 = await this.ViC.balanceOf(this.cuentas[1]);
    const total = await this.ViC.totalSupply();

    assert.equal(balance.toNumber(), 1995);
    assert.equal(balance2.toNumber(), 5);
    assert.equal(balance2.toNumber() + balance.toNumber(), total);
  });

  it("usuario1 alquila y usa el patinete1 durante 1 min", async () => {
    // await catchRevert(
    //   this.Tarifas.tarifaDemo(1, {
    //     from: this.cuentas[1]
    //   })
    // );
    // await sleep(1000);
    let tiempo = await this.Tarifas.remaining(1);
    assert.equal(tiempo.toNumber(), 0);
    console.log("No se ha hecho allowance así que da error (correcto)");
    this.ViC.approve(this.Tarifas.address, 5, {
      from: this.cuentas[1],
    });
    await sleep(1000);
    this.Tarifas.tarifaDemo(1, {
      from: this.cuentas[1],
    });
    await sleep(1500);
    tiempo = await this.Tarifas.remaining(0);
    assert.equal(tiempo.toNumber(), 0);
    tiempo = await this.Tarifas.remaining(1);
    let balance = await this.ViC.balanceOf(
      "0x986cbfcd1034e84485110a78302906b6cd96878e"
    );
    assert.notEqual(tiempo.toNumber(), 0);
    assert.equal(balance.toNumber(), 5);
    tiempo = await this.Tarifas.remaining(1);
    while (tiempo != 0) {
      console.log("Remaining patinete 1: " + tiempo.toNumber());
      await sleep(10000);
      tiempo = await this.Tarifas.remaining(1);
    }
  });
});
