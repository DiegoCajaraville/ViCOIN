// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

/*


*/

contract Tarifas {

    Patinete[] public Patinetes;
    uint256 public TiempoT1 = 4 hours;
    uint256 public TiempoT2 = 2 hours;
    uint256 public TiempoT3 = 1 hours;
    uint256 public TiempoT4 = 30 minutes;
    uint256 public TiempoDemo = 2 minutes;
    address Admin;

    struct Patinete {
        uint256 IdPatinete;
        uint256 deadLine;
        address payable direccion;
    }

    constructor() {
        Admin = msg.sender;
    }

    function tarifa1(uint256 _IdPatinete) public payable{}
    function tarifa2(uint256 _IdPatinete) public payable{}
    function tarifa3(uint256 _IdPatinete) public payable{}
    function tarifa4(uint256 _IdPatinete) public payable{}
    function tarifaDemo(uint256 _IdPatinete) public payable{}


    //Se le debe dar el tiempo en segundos
    function setTarifa(uint256 NTarifa, uint256 newTime) public soloAdmin{
        if(NTarifa == 1){
            TiempoT1 = newTime;
        } else if(NTarifa == 2){
            TiempoT2 = newTime;
        } else if(NTarifa == 3){
            TiempoT3 = newTime;
        } else if(NTarifa == 4){
            TiempoT4 = newTime;
        } else {
            TiempoDemo = newTime;
        }
    }

    function newPatinete(address _direccion) public soloAdmin{}

    function compruebaUsable(uint256 _IdPatinete) internal returns (bool){}
    
    //Devuelve el tiempo que queda de uso en segundos
    function remaining(uint256 _IdPatinete) public view returns (uint256){
        uint256 res = Patinetes[_IdPatinete].deadLine - block.timestamp;
        if(res < 0){
            res = 0;
        }
        return res;
    }

    modifier soloAdmin() {
        require(msg.sender == Admin);
        _;
    }

}