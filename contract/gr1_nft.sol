// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract GRNFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string baseURI;
    string public baseExtension = ".json";
    uint256 public cost = 0.01 ether;
    uint256 public maxSupply = 179;
    uint256 public maxMintAmount = 3;
    bool public paused = false;
    int8[179] public listTokenId;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI
    ) ERC721(_name, _symbol) {
        setBaseURI(_initBaseURI);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function mint(uint256[] memory tokenIds) public payable {
        uint256 _mintAmount = tokenIds.length;
        uint256 supply = totalSupply();
        require(!paused, "Smart contract paused");
        require(_mintAmount > 0, "Invalid mint amount");
        require(_mintAmount + balanceOf(msg.sender) <= maxMintAmount, "Invalid mint amount");
        require(supply + _mintAmount <= maxSupply, "Exceeded supply");
        require(msg.value == cost * _mintAmount, "Insufficient funds");
        
        for (uint256 i = 0; i < _mintAmount; i++) {
            _safeMint(msg.sender, tokenIds[i]);
            listTokenId[tokenIds[i]-1] = 1;
        }
    }

    function walletOfOwner(
        address _owner
    ) public view returns (uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }

    function setMaxMintAmount(uint256 _newMaxMintAmount) public onlyOwner {
        maxMintAmount = _newMaxMintAmount;
    }

    function setmaxSuply(uint256 _newMaxSupply) public onlyOwner {
        maxSupply = _newMaxSupply;
    }
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(
        string memory _newBaseExtension
    ) public onlyOwner {
        baseExtension = _newBaseExtension;
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }
    
    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    function getListTokenId() public view returns (int8[179] memory) {
        return listTokenId;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function withdraw() public payable onlyOwner {
        // Burn 5%
        (bool bs, ) = payable(0x0000000000000000000000000000000000000000).call{
            value: (address(this).balance * 5) / 100
        }("");
        require(bs);

        // This will payout the owner 95% of the contract balance.
        (bool success, bytes memory data) = owner().call{value: address(this).balance}("");
        require(success == true, "Failed to send ETH");
    }
}
