import { useEffect, useState } from "react";
import "./App.scss";
import { Offcanvas } from "react-bootstrap";
import {
  MediaRenderer,
  Web3Button,
  metamaskWallet,
  useAddress,
  useConnect,
  useContract,
  useContractWrite,
} from "@thirdweb-dev/react";
import contractABI from "./contract/contractABI";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

let ipfsImages = [];

function App() {
  const [selectedNFTs, setSelectedNFTs] = useState([]);
  const [maxMintAmount, setMaxMintAmount] = useState(3);
  const [availableToken, setAvailableToken] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const address = useAddress();
  const connect = useConnect();
  const metamaskConfig = metamaskWallet();
  const { contract } = useContract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    contractABI
  );

  const { mutateAsync, isLoading, error } = useContractWrite(contract, "mint");

  useEffect(() => {
    async function getWalletOfOwner() {
      if (!!address) {
        const result = await contract.call("walletOfOwner", [address]);
        if (result) {
          setOwnedNFTs(
            result.map((item) => ({
              id: item.toNumber(),
              link: `${
                import.meta.env.VITE_BASE_IMAGES_IPFS_URL
              }${item.toNumber()}.jpg`,
            }))
          );
          setMaxMintAmount(3 - result.length);
        }
      }
    }
    getWalletOfOwner();
  }, [address]);

  // OffCanvas
  const handleCloseCart = () => setShowCart(false);
  const handleShowCart = () => setShowCart(true);
  const handleCloseInventory = () => setShowInventory(false);
  const handleShowInventory = () => setShowInventory(true);

  const handleConnect = async () => {
    await connect(metamaskConfig);
  };

  async function getListTokenId() {
    const result = await contract.call("getListTokenId");
    setAvailableToken(result);
    return result;
  }

  useEffect(() => {
    if (contract) getListTokenId();
  }, [contract]);

  useEffect(() => {
    if (availableToken.length > 0)
      for (var i = 1; i <= 179; i++) {
        if (availableToken[i - 1] !== 1)
          ipfsImages[i] = {
            id: i,
            link: `${import.meta.env.VITE_BASE_IMAGES_IPFS_URL}${i}.jpg`,
          };
      }
  }, [availableToken]);

  const renderPhotos = (source) => {
    return source.map((photo, index) => {
      let selected =
        selectedNFTs.find((item) => item.id === photo.id) !== undefined;
      return (
        <div
          key={index}
          className="col-12 col-xl-3 col-lg-4 col-sm-6 mt-5 d-flex justify-content-center align-items-center"
        >
          <div className="nft-container">
            <MediaRenderer
              key={photo.id}
              alt={photo.id}
              src={photo.link}
              className={`nft-image ${selected ? "selected" : ""}`}
              onClick={() => {
                if (!selected) {
                  if (selectedNFTs.length !== maxMintAmount)
                    setSelectedNFTs([...selectedNFTs, photo]);
                  else toast.error("You have reach max mint amount");
                } else
                  setSelectedNFTs(
                    selectedNFTs.filter((item) => item.id !== photo.id)
                  );
              }}
            />
          </div>
        </div>
      );
    });
  };

  function CartOffCanvas(props) {
    const { handleClose, show, items } = props;

    return (
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton className="p-4 border-bottom">
          <Offcanvas.Title>Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-4">
          {items && items?.length !== 0 ? (
            items.map((item) => (
              <MediaRenderer
                key={item.id}
                alt={item.id}
                src={item.link}
                className={`offcanvas-item`}
                onClick={() => {
                  setSelectedNFTs(
                    selectedNFTs.filter((nft) => nft.id !== item.id)
                  );
                }}
              />
            ))
          ) : (
            <div className="my-5 text-center">Add items to get started.</div>
          )}
          <Web3Button
            className={`mint-button mt-3`}
            contractAddress={import.meta.env.VITE_CONTRACT_ADDRESS}
            action={() =>
              mutateAsync({
                args: [selectedNFTs.map((item) => item.id)],
                overrides: {
                  gasLimit: 300000,
                  value: ethers.utils.parseEther(
                    (selectedNFTs.length * 0.01).toString()
                  ),
                },
              })
            }
            isDisabled={selectedNFTs.length === 0}
            onSuccess={() => {
              toast.success("MINT SUCCESSFULLY");
              setSelectedNFTs([]);
              if (contract) getListTokenId();
            }}
            onError={() => {
              if (error) toast.error("MINT UNSUCCESSFULLY");
            }}
          >
            Mint
          </Web3Button>
        </Offcanvas.Body>
      </Offcanvas>
    );
  }

  function InventoryOffCanvas(props) {
    const { handleClose, show, items } = props;

    return (
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton className="p-4 border-bottom">
          <Offcanvas.Title>Your NFTs</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-4">
          {items && items?.length !== 0 ? (
            <div>
              <div className="mt-1 mb-3 text-center">
                Click a NFT to view on OpenSea
              </div>

              {items.map((item) => (
                <MediaRenderer
                  key={item.id}
                  alt={item.id}
                  src={item.link}
                  className={`offcanvas-item`}
                  onClick={() => {
                    window.open(
                      `https://testnets.opensea.io/assets/goerli/${import.meta.env.VITE_CONTRACT_ADDRESS.toLowerCase()}/${
                        item.id
                      }`
                    );
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="my-5 text-center">Empty.</div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    );
  }

  return (
    <div>
      <div className="background-image"></div>
      <div className="container">
        <div className="nav-bar d-flex justify-content-between align-items-center">
          <div className="logo">KNFT</div>
          <div className="d-flex">
            <button
              className="connect-wallet-button"
              onClick={() => handleConnect()}
              disabled={!!address}
            >
              {!address ? "Connect Wallet" : "Wallet Connected"}
            </button>
            {address && (
              <div
                className="icon-user"
                onClick={() => {
                  handleShowInventory();
                }}
              >
                <i className="fas fa-user"></i>
              </div>
            )}
            <div className="icon-cart" onClick={() => handleShowCart()}>
              <i className="fas fa-cart-shopping"></i>
              {selectedNFTs.length !== 0 && (
                <div className="cart-label">{selectedNFTs.length}</div>
              )}
            </div>
          </div>
        </div>
        <div className="instruction">
          <div>You can choose at most {maxMintAmount} images to mint</div>
        </div>
        <div className="content mb-5">
          <div className="row">{renderPhotos(ipfsImages)}</div>
        </div>

        <div className="footer">
          <div className="container d-flex justify-content-between align-content-center h-100">
            <div className="my-auto">© Copyright By Dinh Ngoc Khue</div>
            <div className="my-auto">Graduation Research 1</div>
          </div>
        </div>

        <CartOffCanvas
          show={showCart}
          handleShow={handleShowCart}
          handleClose={handleCloseCart}
          items={selectedNFTs}
        />
        <InventoryOffCanvas
          show={showInventory}
          handleShow={handleShowInventory}
          handleClose={handleCloseInventory}
          items={ownedNFTs}
        />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
