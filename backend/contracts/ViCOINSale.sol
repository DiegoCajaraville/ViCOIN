// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./ViCOIN.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/*
    Acciones que se deberian poder llevar a cabo sobre este contrato:
    *ADMIN:
        - Editar {tokenPrice} V
        - Llamar a ViCERC20.mint() V
        - Obtener el dinero de este contrato (lo pagado por los clientes) V
    *CLIENTES:
        - Comprar ViCOINs V
        - Consultar precio ViCOINs V
        - SOBRE ViCOIN:    
            - Consultar cuantos ViCOINs hay disponibles V
*/

contract ViCOINSale {

    using SafeMath for uint256;
    address public admin;
    ViCOIN public ViCERC20;
    uint256 public tokenPrice = 1 * 10 ** 16;
    // unidades en wheis, por lo tanto son 0.01 ETH cada ViCOIN
    uint256 public tokensSold = 0;


    event Sell(address _buyer, uint256 _amount);

    constructor() {
        admin = msg.sender;
        ViCERC20 = new ViCOIN();
    }

    function getPrice(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = y.mul(x).div(10**18);
    }

    function setPrice(uint256 newPrice) public soloAdmin {
        tokenPrice = newPrice;
    }

    function moreSupply(uint256 newViCs) public soloAdmin {
        ViCERC20.mint(address(this), newViCs);
    }

    function getFunds() public soloAdmin {
        require(payable(msg.sender).send(address(this).balance));
    }

    function buyViCOINS(uint256 number) public payable {
        require(msg.value == getPrice(number,tokenPrice));
        require(ViCERC20.balanceOf(address(this)) >= number);
        require(ViCERC20.transfer(msg.sender, number));

        tokensSold += number;

        emit Sell(msg.sender, number);
    }

    modifier soloAdmin() {
        require(msg.sender == admin);
        _;
    }
}
