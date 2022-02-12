const ViCOINSale = artifacts.require("ViCOINSale")

contract("ViCOINSale", () => {

    before( async () => {
        this.ViCSale = await ViCOINSale.deployed()
    })

    it('migrates deployed successfully', async () => {
        const addressViCSale = this.ViCSale.address

        // const addressViCERC20 = this.ViCSale.ViCERC20 -> No devuelve la dirección

        console.log(addressViCSale);
        // console.log(this.ViCSale.ViCERC20.balanceOf(addressViCSale));

        assert.notEqual(addressViCSale,null);
        assert.notEqual(addressViCSale,undefined);
        assert.notEqual(addressViCSale,0x0);
        assert.notEqual(addressViCSale,'');
    })

})