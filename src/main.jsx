import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "../public/fontawesome/css/all.css";
import App from "./App.jsx";
import { Sepolia, Goerli } from "@thirdweb-dev/chains";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { metamaskWallet } from "@thirdweb-dev/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThirdwebProvider
      activeChain={Goerli}
      supportedWallets={[metamaskWallet()]}
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
