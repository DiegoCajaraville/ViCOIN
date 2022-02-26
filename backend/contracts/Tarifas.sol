// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./ViCOINSale.sol";
import "./ViCOIN.sol";

/*
 * Ver que pasa con importar el ViCOIN contract
 */

contract Tarifas {

    using Counters for Counters.Counter;
    Counters.Counter private cuentaPatinetes;
    
    uint256 public TiempoT1 = 1 hours;
    uint256 public TiempoT2 = 45 minutes;
    uint256 public TiempoT3 = 30 minutes;
    uint256 public TiempoT4 = 15 minutes;
    uint256 public TiempoDemo = 3 minutes;

    //Los costes en weis de ViC
    uint256 public CosteT1 = 18 * 10 ** 18;
    uint256 public CosteT2 = 15 * 10 ** 18;
    uint256 public CosteT3 = 10 * 10 ** 18;
    uint256 public CosteT4 = 5 * 10 ** 18;
    uint256 public CosteDemo = 1 * 10 ** 18;

    address dirContrato;
    address public Admin;
    ViCOINSale public ViCSale;
    ViCOIN public ViCERC20;
    Patinete[] public Patinetes;

    struct Patinete {
        uint256 IdPatinete;
        uint256 deadLine;
        address payable direccion;
        address usuarioActual;
    }

    constructor(address _dirContrato) {
        Admin = msg.sender;
        dirContrato = _dirContrato;
        ViCSale = ViCOINSale(dirContrato);
        ViCERC20 = ViCSale.ViCERC20();
    }

    //El front-end se debería ocupar de ver pedirle approve en caso de no tenerlo.
    //No hay forma de hacerlo en el back
    function tarifa1(uint256 _IdPatinete) public {
        if(remaining(_IdPatinete) > 0){
            require(msg.sender == Patinetes[_IdPatinete].usuarioActual);
        }
        require(ViCERC20.allowance(msg.sender, address(this)) >= CosteT1);
        require(
            ViCERC20.transferFrom(
                msg.sender,
                Patinetes[_IdPatinete].direccion,
                CosteT1
            )
        );
        Patinetes[_IdPatinete].usuarioActual = msg.sender;
        Patinetes[_IdPatinete].deadLine = block.timestamp + TiempoT1;
    }

    function tarifa2(uint256 _IdPatinete) public {
        if(remaining(_IdPatinete) > 0){
            require(msg.sender == Patinetes[_IdPatinete].usuarioActual);
        }
        require(ViCERC20.allowance(msg.sender, address(this)) >= CosteT2);
        require(
            ViCERC20.transferFrom(
                msg.sender,
                Patinetes[_IdPatinete].direccion,
                CosteT2
            )
        );
        Patinetes[_IdPatinete].usuarioActual = msg.sender;
        Patinetes[_IdPatinete].deadLine = block.timestamp + TiempoT2;
    }

    function tarifa3(uint256 _IdPatinete) public {
        if(remaining(_IdPatinete) > 0){
            require(msg.sender == Patinetes[_IdPatinete].usuarioActual);
        }
        require(ViCERC20.allowance(msg.sender, address(this)) >= CosteT3);
        require(
            ViCERC20.transferFrom(
                msg.sender,
                Patinetes[_IdPatinete].direccion,
                CosteT3
            )
        );
        Patinetes[_IdPatinete].usuarioActual = msg.sender;
        Patinetes[_IdPatinete].deadLine = block.timestamp + TiempoT3;
    }

    function tarifa4(uint256 _IdPatinete) public {
        if(remaining(_IdPatinete) > 0){
            require(msg.sender == Patinetes[_IdPatinete].usuarioActual);
        }
        require(ViCERC20.allowance(msg.sender, address(this)) >= CosteT4);
        require(
            ViCERC20.transferFrom(
                msg.sender,
                Patinetes[_IdPatinete].direccion,
                CosteT4
            )
        );
        Patinetes[_IdPatinete].usuarioActual = msg.sender;
        Patinetes[_IdPatinete].deadLine = block.timestamp + TiempoT4;
    }

    function tarifaDemo(uint256 _IdPatinete) public {
        if(remaining(_IdPatinete) > 0){
            require(msg.sender == Patinetes[_IdPatinete].usuarioActual);
        }
        require(ViCERC20.allowance(msg.sender, address(this)) >= CosteDemo);
        require(
            ViCERC20.transferFrom(
                msg.sender,
                Patinetes[_IdPatinete].direccion,
                CosteDemo
            )
        );
        Patinetes[_IdPatinete].usuarioActual = msg.sender;
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
    //Se le debe dar el coste en weis de ViC
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

    function newPatinete(address _direccion) public soloAdmin {
        uint256 newPatId = cuentaPatinetes.current();
        cuentaPatinetes.increment();
        Patinete memory pat;
        pat.IdPatinete = newPatId;
        pat.direccion = payable(_direccion);
        pat.deadLine = 0;
        pat.usuarioActual = Admin;
        Patinetes.push(pat);
    }

    //Devuelve los Ids de los patinetes disponibles para su uso
    function getPatinetes() public view returns (uint256 [] memory){
        uint256 iterator = Patinetes.length;
        uint256 max = 0;
        for(uint256 i = 0; i < iterator; i++){
            if(remaining(Patinetes[i].IdPatinete) <= 0){
                max++;
            }
        }
        uint256[] memory Ids = new uint256[](max);
        for(uint256 i = 0; i < iterator; i++){
            if(remaining(Patinetes[i].IdPatinete) <= 0){
                Ids[i] = i;
            }
        }
        return Ids;
    }
    
    function totalPatinetes() public view returns(uint256){
        return cuentaPatinetes.current();
    }

    //Devuelve el tiempo que queda de uso en segundos
    function remaining(uint256 _IdPatinete) public view returns (uint256) {
        return (Patinetes[_IdPatinete].deadLine < block.timestamp) ? (0) : (Patinetes[_IdPatinete].deadLine - block.timestamp);
    }

    modifier soloAdmin() {
        require(msg.sender == Admin);
        _;
    }
}
