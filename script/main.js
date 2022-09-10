//this is a script file
var web3;
var walletAddress;
var isConnect = false;
function E(id) {
  return document.getElementById(id);
}

//check if it has injected web3 provider
if (!window.ethereum) {
  //diable the connect wallet and add chain button
  E("_connect").disabled = true;
  E("_addChain").disabled = true;
  E("_connect").className = "";
  E("_addChain").className = "this_but";
  E("_addChain").style.background = "#f1f1f1";
}
//function to connect wallet
async function connectWallet() {
  if (!isConnect) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
    const account = web3.eth.accounts;
    //Get the current MetaMask selected/active wallet
    walletAddress = account.givenProvider.selectedAddress;
    //change the wallet address
    E("_address").value = walletAddress;
    //disable the input field
    E("_address").disabled = true;
    E("_connect").value = "Disconnect Wallet";
    isConnect = true;
  } else {
    //disconnect wallet
    walletAddress = "";
    E("_address").value = "";
    //disable the input field
    E("_address").disabled = false;
    E("_connect").value = "Connect Wallet";
    isConnect = false;
  }
}
//function to add INDO chain
function addChain() {
  window.ethereum
    .request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "772",
          chainName: "Indo Smart Chain",
          nativeCurrency: {
            name: "Indo Coin",
            symbol: "INDO",
            decimals: 18,
          },
          rpcUrls: ["http://149.102.149.54:8545"],
          blockExplorerUrls: ["https://indo-testnet.com"],
        },
      ],
    })
    .catch((error) => {
      alert("Unable to add chain");
    });
}
//function to request tokens
function requestToken() {
  walletAddress = E("_address").value;
  console.log(walletAddress);
  if (walletAddress != "") {
    //start the fetch request
    const data = {
      address: [walletAddress],
    }; //construct the payment request here
    //Start the fetch request
    talk("Requesting tokens...", false);
    fetch("http://localhost:8080/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        //process results here
        E("_message").style.display = "none";
        console.log(data);
        if (data.success == true) {
          talk("Tokens requested successfully");
        } else {
          talk(data.message);
        }
      })
      .catch((error) => {
        //process error here
        console.log(error);
        talk("Unable to request tokens");
      });
  } else {
    talk("Please connect your wallet or enter your wallet address");
  }
}
//show message
function talk(_msg, disappear = true) {
  E("_message").innerHTML = _msg;
  E("_message").style.display = "block";

  if (disappear) {
    //start timeout to hide message
    setTimeout(function () {
      E("_message").style.display = "none";
    }, 7500);
  }
}
