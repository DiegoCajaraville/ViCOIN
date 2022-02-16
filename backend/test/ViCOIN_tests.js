const ViCOINSale = artifacts.require("ViCOINSale");
const ViCOIN = artifacts.require("ViCOIN");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

contract("ViCOINSale", () => {
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
    assert.equal(addressViCSale,owner.toString());
  });

  it("Bought of 5 ViCOINs succeeded", async () => {
    this.ViCSale.buyViCOINS(5, {value: web3.utils.toWei('0.05', 'ether'), from: this.cuentas[1]});
    
    //Hay que dar tiempo a la blockchain a actualizarse
    await sleep(200);

    const balance = await this.ViC.balanceOf(this.ViCSale.address);
    const balance2 = await this.ViC.balanceOf(this.cuentas[1]);
    const total = await this.ViC.totalSupply();

    assert.equal(balance.toNumber(), 1995);
    assert.equal(balance2.toNumber(), 5);
    assert.equal(balance2.toNumber() + balance.toNumber(), total);
    
  });

  //Cambiar precio done
  //it comprar 1996 ViCs error
  //it mintear 5 ViCs succeed
  //it comprar 1996 ViCs done
  //it retirar los fondos al admin

});
