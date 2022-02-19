// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./ViCOINSale.sol";
import "./ViCOIN.sol";

/*
 * Ver que pasa con importar el ViCOIN contract
 * Implementar metodo crear patinetes
 */

contract Tarifas {
    Patinete[] public Patinetes;
    uint256 public TiempoT1 = 4 hours;
    uint256 public TiempoT2 = 2 hours;
    uint256 public TiempoT3 = 1 hours;
    uint256 public TiempoT4 = 30 minutes;
    uint256 public TiempoDemo = 2 minutes;

    //Los costes en unidades de ViC (son indivisibles de momento)
    uint256 public CosteT1 = 100;
    uint256 public CosteT2 = 50;
    uint256 public CosteT3 = 30;
    uint256 public CosteT4 = 20;
    uint256 public CosteDemo = 5;

    address Admin;
    ViCOINSale public ViCSale;
    ViCOIN public ViCERC20;

    struct Patinete {
        uint256 IdPatinete;
        uint256 deadLine;
        address payable direccion;
    }

    constructor() {
        Admin = msg.sender;
        ViCSale = new ViCOINSale();
        ViCERC20 = ViCSale.ViCERC20();
    }

    //El front-end se debería ocupar de ver pedirle approve en caso de no tenerlo.
    //No hay forma de hacerlo en el back
    function tarifa1(uint256 _IdPatinete) public payable {
        require(ViCERC20.allowance(msg.sender, address(this)) >= CosteT1);
        require(
            ViCERC20.transferFrom(
                msg.sender,
                Patinetes[_IdPatinete].direccion,
                CosteT1
            )
        );
        Patinetes[_IdPatinete].deadLine = block.timestamp + TiempoT1;
    }

    function tarifa2(uint256 _IdPatinete) public payable {
        require(ViCERC20.allowance(msg.sender, address(this)) >= CosteT2);
        require(
            ViCERC20.transferFrom(
                msg.sender,
                Patinetes[_IdPatinete].direccion,
                CosteT2
            )
        );
        Patinetes[_IdPatinete].deadLine = block.timestamp + TiempoT2;
    }

    function tarifa3(uint256 _IdPatinete) public payable {
        require(ViCERC20.allowance(msg.sender, address(this)) >= CosteT3);
        require(
            ViCERC20.transferFrom(
                msg.sender,
                Patinetes[_IdPatinete].direccion,
                CosteT3
            )
        );
        Patinetes[_IdPatinete].deadLine = block.timestamp + TiempoT3;
    }

    function tarifa4(uint256 _IdPatinete) public payable {
        require(ViCERC20.allowance(msg.sender, address(this)) >= CosteT4);
        require(
            ViCERC20.transferFrom(
                msg.sender,
                Patinetes[_IdPatinete].direccion,
                CosteT4
            )
        );
        Patinetes[_IdPatinete].deadLine = block.timestamp + TiempoT4;
    }

    function tarifaDemo(uint256 _IdPatinete) public payable {
        require(ViCERC20.allowance(msg.sender, address(this)) >= CosteDemo);
        require(
            ViCERC20.transferFrom(
                msg.sender,
                Patinetes[_IdPatinete].direccion,
                CosteDemo
            )
        );
        Patinetes[_IdPatinete].deadLine = block.timestamp + TiempoDemo;
    }

    //Se le debe dar el tiempo en segundos
    function setTarifa(uint256 NTarifa, uint256 newTime) public soloAdmin {
        if (NTarifa == 1) {
            TiempoT1 = newTime;
        } else if (NTarifa == 2) {
            TiempoT2 = newTime;
        } else if (NTarifa == 3) {
            TiempoT3 = newTime;
        } else if (NTarifa == 4) {
            TiempoT4 = newTime;
        } else {
            TiempoDemo = newTime;
        }
    }
    //Se le debe dar el coste en unidades de ViC
    function setCoste(uint256 NTarifa, uint256 newCost) public soloAdmin {
        if (NTarifa == 1) {
            CosteT1 = newCost;
        } else if (NTarifa == 2) {
            CosteT2 = newCost;
        } else if (NTarifa == 3) {
            CosteT3 = newCost;
        } else if (NTarifa == 4) {
            CosteT4 = newCost;
        } else {
            CosteDemo = newCost;
        }
    }

    function newPatinete(address _direccion) public soloAdmin {}

    //Devuelve el tiempo que queda de uso en segundos
    function remaining(uint256 _IdPatinete) public view returns (uint256) {
        uint256 res = Patinetes[_IdPatinete].deadLine - block.timestamp;
        if (res < 0) {
            res = 0;
        }
        return res;
    }

    modifier soloAdmin() {
        require(msg.sender == Admin);
        _;
    }
}
