const ViCOINSale = artifacts.require("ViCOINSale");
const ViCOIN = artifacts.require("ViCOIN");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

contract("ViCOINSale", () => {
  let catchRevert = require("./exceptions.js").catchRevert;

  before(async () => {
    this.ViCSale = await ViCOINSale.deployed();
    const addressViC = await this.ViCSale.ViCERC20();
    this.ViC = await ViCOIN.at(addressViC.toString());
    this.cuentas = await web3.eth.getAccounts();
    this.admin = this.cuentas[0];
  });

  it("migrates deployed successfully", async () => {
    const addressViCSale = this.ViCSale.address;
    const owner = await this.ViC.owner();
    assert.equal(addressViCSale, owner.toString());
  });

  it("Compra de 5 ViCOINs llevada a cabo correctamente", async () => {
    this.ViCSale.buyViCOINS(5, {
      value: web3.utils.toWei("0.05", "ether"),
      from: this.cuentas[1],
    });

    //Hay que dar tiempo a la blockchain a actualizarse
    await sleep(300);

    const balance = await this.ViC.balanceOf(this.ViCSale.address);
    const balance2 = await this.ViC.balanceOf(this.cuentas[1]);
    const total = await this.ViC.totalSupply();

    assert.equal(balance.toNumber(), 1995);
    assert.equal(balance2.toNumber(), 5);
    assert.equal(balance2.toNumber() + balance.toNumber(), total);
  });

  it("Cambiar precio a los ViCs a 0.001 ETH", async () => {
    this.ViCSale.setPrice(web3.utils.toWei("0.001", "ether"));
    await sleep(300);
    const tokenPrice = await this.ViCSale.tokenPrice();
    assert.equal(tokenPrice.toString(), web3.utils.toWei("0.001", "ether"));
  });

  it("Compra de 1996 ViCs da error (correctamente)", async () => {
    await catchRevert(
      this.ViCSale.buyViCOINS(1996, {
        value: web3.utils.toWei("1.996", "ether"),
        from: this.cuentas[2],
      })
    );
    await sleep(300);
    let balance = await this.ViC.balanceOf(this.cuentas[2]);
    let vendidos = await this.ViCSale.tokensSold();
    assert.equal(balance.toNumber(), "0");
    assert.equal(vendidos.toNumber(), 5);
  });

  it("Minteo de 5 ViCs con exito (TotalSupply = 2005)", async () => {
    this.ViCSale.moreSupply(5);
    await sleep(300);
    let balancetotal = await this.ViC.totalSupply();
    let balanceContrato = await this.ViC.balanceOf(this.ViCSale.address);
    assert.equal(balancetotal.toNumber(), 2005);
    assert.equal(balanceContrato.toNumber(), 2000);
  });

  it("Compra de 1996 ViCs llevada a cabo correctamente", async () => {
    this.ViCSale.buyViCOINS(1996, {
      value: web3.utils.toWei("1.996", "ether"),
      from: this.cuentas[2],
    });
    await sleep(300);
    let balanceComprador = await this.ViC.balanceOf(this.cuentas[2]);
    let vendidos = await this.ViCSale.tokensSold();
    assert.equal(balanceComprador.toNumber(), 1996);
    assert.equal(vendidos.toNumber(), 2001);
  });

  it("Retirada de fondos del admin llevada a cabo con exito", async () => {
    await catchRevert(
      this.ViCSale.getFunds({
        from: this.cuentas[3],
      })
    );
    await sleep(300);
    let eth = await web3.eth.getBalance(this.ViCSale.address);
    assert.notEqual(eth.toString(), '0');
    this.ViCSale.getFunds();
    await sleep(300);
    eth = await web3.eth.getBalance(this.ViCSale.address);
    assert.equal(eth.toString(), '0');
  });
});
