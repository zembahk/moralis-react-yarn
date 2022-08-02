import React, { useEffect, useState } from 'react';
//import logo from './logo.svg';
import './App.css';
import  {CONTRACT_ABI, CONTRACT_ADDRESS } from './abi';
import { useMoralis } from "react-moralis";
import Moralis from 'moralis/types';

function App() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [bamboo, setBamboo] = useState("");
  const [feed, setFeed] = useState("");
  

  const handleNameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setName(event.target.value);
  };
  const handleIdChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setId(event.target.value);
  };
  const handleBambooChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setBamboo(event.target.value);
  };
  const handleFeedChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setFeed(event.target.value);
  };

  const { Moralis, authenticate, isAuthenticated, isAuthenticating, user, logout } = useMoralis();

  useEffect(() => {
    
    if (isAuthenticated) {

    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const login = async () => {
    if (!isAuthenticated) {
      await authenticate({signingMessage: "Log in using Moralis" })
        .then(function (user) {
          console.log("Logged in user:\n\t", user!.get("ethAddress"));
          console.log(user);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  const logOut = async () => {
    console.log("Logged in as: \n\t",user!.get("ethAddress"));
    await logout();
    console.log("Logging out DONE");
  }

  const exeFunc = async (options: Moralis.ExecuteFunctionOptions) => {
    await Moralis.enableWeb3();
    const result = await Moralis.executeFunction(options);
    const json = JSON.parse(JSON.stringify(result));
    console.log("result", json);
    return json;
  }

  const getTimesFed = async () => {
    const options = {
      contractAddress: CONTRACT_ADDRESS,
      functionName: "getTimesFed",
      abi: CONTRACT_ABI,
      params: { nft_id: parseInt(id) }
    };
    const result = await exeFunc(options);
    return parseInt(result.hex, 16);
  }

  const newPanda = async () => {
    if (!user){return};
    const options = {
      contractAddress: CONTRACT_ADDRESS,
      functionName: "createHogePanda",
      abi: CONTRACT_ABI,
      msgValue: Moralis.Units.ETH("0.025"),
      params: { account: user.get('ethAddress'), nft_name: name }
    };
    exeFunc(options);
  }
  
  const createBamboo = async () => {
    if (!user){return};
    const price = parseInt(bamboo) * 0.01;
    const options = {
      contractAddress: CONTRACT_ADDRESS,
      functionName: "createBamboo",
      abi: CONTRACT_ABI,
      msgValue: Moralis.Units.ETH(price),
      params: { account: user.get('ethAddress'), amount: parseInt(bamboo) }
    };
    exeFunc(options);
  }

  const feedBamboo = async () => {
    if (!user){return};
    const price = (parseInt(feed) * 0.01);
    const options = {
      contractAddress: CONTRACT_ADDRESS,
      functionName: "feedBamboo",
      abi: CONTRACT_ABI,
      msgValue: Moralis.Units.ETH(price),
      params: { account: user.get('ethAddress'), nft_id: parseInt(id), amount: parseInt(feed) }
    };
    exeFunc(options);
  }
  
  const growToYoung = async () => {
    if (!user){return};
    const options = {
      contractAddress: CONTRACT_ADDRESS,
      functionName: "growToYoung",
      abi: CONTRACT_ABI,
      msgValue: Moralis.Units.ETH("0.05"),
      params: { account: user.get('ethAddress'), nft_id: parseInt(id) }
    };
    exeFunc(options);
  }

  const growToAdult = async () => {
    if (!user){return};
    const options = {
      contractAddress: CONTRACT_ADDRESS,
      functionName: "growToAdult",
      abi: CONTRACT_ABI,
      msgValue: Moralis.Units.ETH("0.1"),
      params: { account: user.get('ethAddress'), nft_id: parseInt(id) }
    };
    exeFunc(options);
  }

  return (
    <div>
      <h1>🀤🐼HogePandas🐼🀤</h1>
      <button id="login_btn" onClick={login} disabled={isAuthenticated || isAuthenticating}>Moralis Metamask Login</button>
      <button id="logout_btn" onClick={logOut} disabled={!isAuthenticated}>Logout</button>
      <p></p>
      <p></p>
      <label> Name: </label><br></br>
      <input id="input_name" type="text" name="name"  onChange={handleNameChange} value={name} />
      <button id="panda_btn" onClick={newPanda} disabled={!isAuthenticated || !name}>New HogePanda 🐼</button>
      <p></p>
      <label> Amount: </label><br></br>
      <input id="input_bamboo" type="number" name="bamboo"  onChange={handleBambooChange} value={bamboo} />
      <button id="bamboo_btn" onClick={createBamboo} disabled={!isAuthenticated || !bamboo}>Get Bamboo 🀤</button>
      <br></br>
      <input id="input_feed" type="number" name="feed"  onChange={handleFeedChange} value={feed}/>
      <button id="feed_btn" onClick={feedBamboo} disabled={!isAuthenticated || !feed || !id}>Feed 🐼 Bamboo 🀤</button>
      <br></br>
      <p></p>
      <div id="times_fed"></div> <label> Token ID: </label>
      <button id="fed_btn" onClick={getTimesFed} disabled={!isAuthenticated || !id}>Times Fed 🀤</button>
      <br></br>
      <input id="input_id" type="number" name="id" onChange={handleIdChange} value={id} /><br></br>
      <button id="young_btn" onClick={growToYoung} disabled={!isAuthenticated || !id}>Grow To Young 🐼</button>
      <button id="adult_btn" onClick={growToAdult} disabled={!isAuthenticated || !id}>Grow To Adult 🐼</button>
    </div>
  );
}

export default App;
