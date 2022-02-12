const ViCOIN = artifacts.require("ViCOIN")

contract("ViCOIN", () => {

    before( async () => {
        this.ViC = await ViCOIN.deployed()
    })

    it('migrate deployed successfully', async () => {
        const address = this.ViC.address

        console.log(address);
        assert.notEqual(address,null);
        assert.notEqual(address,undefined);
        assert.notEqual(address,0x0);
        assert.notEqual(address,'');
    })

})