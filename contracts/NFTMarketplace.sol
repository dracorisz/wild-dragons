// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract NFTMarketplace is ERC721URIStorage, ERC2981, Ownable {
    uint256 public tokenCount;
    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool active;
    }
    mapping(uint256 => Listing) public listings;

    constructor() ERC721("WildDragonsNFT", "WDN") {}

    function mint(string memory uri, uint96 royaltyFee) external {
        tokenCount++;
        _mint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, uri);
        _setTokenRoyalty(tokenCount, msg.sender, royaltyFee);
    }

    function listNFT(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        listings[tokenId] = Listing(tokenId, msg.sender, price, true);
    }

    function buyNFT(uint256 tokenId) external payable {
        Listing memory listing = listings[tokenId];
        require(listing.active, "Not listed");
        require(msg.value >= listing.price, "Insufficient payment");
        address seller = listing.seller;
        listings[tokenId].active = false;
        _transfer(seller, msg.sender, tokenId);
        (address royaltyReceiver, uint256 royaltyAmount) = royaltyInfo(tokenId, msg.value);
        if (royaltyAmount > 0) {
            payable(royaltyReceiver).transfer(royaltyAmount);
        }
        payable(seller).transfer(msg.value - royaltyAmount);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
