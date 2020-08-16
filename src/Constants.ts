export default {
    "CONTRACT_CREATED_BLOCK": 10636560,
    "DELEGATE": "0x683a78ba1f6b25e29fbbc9cd1bfa29a51520de84",
    "YAM_ADDRESS": "0x0e2298e3b3390e3b945a5456fbf59ecc3f55da16",
    "YAM_ABI": [{ "constant": true, "inputs": [{ "internalType": "address", "name": "who", "type": "address" }], "name": "balanceOfUnderlying", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "address",
            "name": "delegator",
            "type": "address"
        }, {
            "indexed": true,
            "internalType": "address",
            "name": "fromDelegate",
            "type": "address"
        }, {
            "indexed": true,
            "internalType": "address",
            "name": "toDelegate",
            "type": "address"
        }],
        "name": "DelegateChanged",
        "type": "event"
    }, {
        "constant": true,
        "inputs": [{
            "internalType": "address",
            "name": "owner",
            "type": "address"
        }],
        "name": "balanceOf",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{
            "internalType": "address",
            "name": "delegator",
            "type": "address"
        }],
        "name": "delegates",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "payable": false,
        "type": "function"
    }] as any

}