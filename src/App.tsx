import React, { useEffect, useState} from 'react'
import './App.css'
import { CONTRACT_ABI } from './abi'
import { useMoralis, useChain } from 'react-moralis'
import Moralis from 'moralis'
import ReactPlayer from 'react-player'


function App() {
  const [name, setName] = useState('')
  const [id, setId] = useState('0')
  const [bamboo, setBamboo] = useState('')
  const [feed, setFeed] = useState('')
  const [fed, setFed] = useState(-1)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [animate, setAnimate] = useState('')
  const [userAddress, setUserAddress] = useState('')
  const [hogePandasAddress] = useState('0x5Ea0333638b035BB911eD77F101C2bea979A2843') // polygon chain 

  const handleNameChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setName(event.target.value)
  }
  const handleIdChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    if (parseInt(id) < 0) {
      setId('0')
    } else {setId(event.target.value)}
  }
  const handleBambooChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    if (parseInt(bamboo) < 1) {
      setBamboo('1')
    } else {setBamboo(event.target.value)}
  }
  const handleFeedChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    if (parseInt(feed) < 1) {
      setFeed('1')
    } else {setFeed(event.target.value)}
  }
  const { switchNetwork, chainId, chain } = useChain()
  const { Moralis, authenticate, isAuthenticated, isAuthenticating, user, logout } = useMoralis()
  const ethers = Moralis.web3Library

  useEffect(() => {
    if (isAuthenticated){
      setUserAddress(user!.get('ethAddress'))
      ethersContract()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, chain])

  const ethersContract = async () => {
    const web3 = await Moralis.enableWeb3()
    const Contract = new ethers.Contract(hogePandasAddress, CONTRACT_ABI, web3)
    if (chainId !== '0x89' || chain === null) {
      switchNetwork('0x89')
      alert("Need to be on polygon network")
    }
    const name = await Contract.name()
    const symbol = await Contract.symbol()
    console.log(name, '\n', symbol)
    return Contract
  }

  const clearData = async () => {
    setTitle('')
    setDescription('')
    setAnimate('')
    setFed(-1)
    setName('')
    setBamboo('')
    setFeed('')
    setId('')
    document.getElementById('input_name')?.focus()
  }

  const login = async () => {
    if (!isAuthenticated) {
      await authenticate({signingMessage: "Log in using Moralis" })
        .then(function (user) {
          if(!user){return}
          console.log("Logged in user:\n\t", userAddress)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }

  const logOut = async () => {
    console.log("Logged in as: \n\t", userAddress)
    await logout()
    setUserAddress('')
    console.log("Logging out DONE")
  }

  const exeFunc = async (options: Moralis.ExecuteFunctionOptions) => {
    try{
      await Moralis.enableWeb3()
      const result = await Moralis.executeFunction(options)
      const json = JSON.parse(JSON.stringify(result))
      return json
    } catch(e) {
      console.log('Error', e)
      return { "error": e }
    }
  }

  const getTokenData = async () => {
    const HogePandaContract = new ethers.Contract(hogePandasAddress, CONTRACT_ABI, await Moralis.enableWeb3())
    const result = await HogePandaContract.getTokenData(id)
    fetch(result)
    .then(response => response.json())
    .then((jsonData) => {
      const obj = JSON.parse(JSON.stringify(jsonData))
      console.log(obj)
      setTitle(obj.title)
      setDescription(obj.description)
      setAnimate(obj.animation_url)
    })
    .catch((error) => {
      console.error(error)
      clearData()
      return
    })
    await getTokenName()
    await getTimesFed()
  }

  const getTimesFed = async () => {
    const options = {
      contractAddress: hogePandasAddress,
      functionName: "getTimesFed",
      abi: CONTRACT_ABI,
      params: { nft_id: parseInt(id) }
    }
    const result = await exeFunc(options)
    setFed(parseInt(result.hex, 16))
  }

  const getTokenName = async () => {
    const options = {
      contractAddress: hogePandasAddress,
      functionName: "getTokenName",
      abi: CONTRACT_ABI,
      params: { nft_id: parseInt(id) }
    }
    const result = await exeFunc(options)
    if(result?.error){clearData()}
    else {
      setName(result)
    }
  }

  const newPanda = async () => {
    if (!user){return}
    const options = {
      contractAddress: hogePandasAddress,
      functionName: "createHogePanda",
      abi: CONTRACT_ABI,
      msgValue: Moralis.Units.ETH("0.025"),
      params: { account: user.get('ethAddress'), nft_name: name }
    }
    const result = await exeFunc(options)
    console.log(result)
  }
  
  const createBamboo = async () => {
    if (!user){return}
    const price = parseInt(bamboo) * 0.01
    const options = {
      contractAddress: hogePandasAddress,
      functionName: "createBamboo",
      abi: CONTRACT_ABI,
      msgValue: Moralis.Units.ETH(price),
      params: { account: user.get('ethAddress'), amount: parseInt(bamboo) }
    }
    const result = await exeFunc(options)
    console.log(result)
  }

  const feedBamboo = async () => {
    if (!user){return}
    const price = (parseInt(feed) * 0.01)
    const options = {
      contractAddress: hogePandasAddress,
      functionName: "feedBamboo",
      abi: CONTRACT_ABI,
      msgValue: Moralis.Units.ETH(price),
      params: { account: user.get('ethAddress'), nft_id: parseInt(id), amount: parseInt(feed) }
    }
    const result = await exeFunc(options)
    console.log(result)
  }
  
  const growToYoung = async () => {
    if (!user){return}
    const options = {
      contractAddress: hogePandasAddress,
      functionName: "growToYoung",
      abi: CONTRACT_ABI,
      msgValue: Moralis.Units.ETH("0.05"),
      params: { account: user.get('ethAddress'), nft_id: parseInt(id) }
    }
    const result = await exeFunc(options)
    console.log(result)
  }

  const growToAdult = async () => {
    if (!user){return}
    const options = {
      contractAddress: hogePandasAddress,
      functionName: "growToAdult",
      abi: CONTRACT_ABI,
      msgValue: Moralis.Units.ETH("0.1"),
      params: { account: user.get('ethAddress'), nft_id: parseInt(id) }
    }
    const result = await exeFunc(options)
    console.log(result)
  }

  return (
    <div>
      <h1>🀤🐼HogePandas🐼🀤
        <p></p>
        <div className='Address'>{userAddress || "Login To Use Functions"}</div>
      </h1>
      <button className='Login' id="login_btn" onClick={login} hidden={isAuthenticated} disabled={isAuthenticating}>Moralis Metamask Login</button>
      <button className='Login' id="logout_btn" onClick={logOut} hidden={!isAuthenticated}>Logout</button>
      <label> Token ID: </label>
      <input className="inp-border a2" id='input_id' type='number' name='id' onChange={handleIdChange} value={id} />
      <br></br>
      <button id='clear_btn' onClick={clearData} >Clear Fields</button>
      <button id='data_btn' onClick={getTokenData} hidden={!isAuthenticated || !id || parseInt(id) < 0}>Fetch Token Data</button>
      <br></br>
      <label> Name: </label>
      <input className="inp-border a2" id="input_name" type="text" name="name" onChange={handleNameChange} value={name} autoFocus disabled={parseInt(id) >= 0}/>
      <button id="panda_btn" onClick={newPanda} disabled={!isAuthenticated || !name || parseInt(id) > -1 }>New HogePanda 🐼</button>
      <br></br>
      <input className="inp-border a2" id="input_title" type="text" name="title" value={title} disabled />
      <input className="inp-border a2" id="input_description" type="text" name="description" value={description} disabled />
      <p></p>
      <button id='young_btn' onClick={growToYoung} disabled={!isAuthenticated || !id 
        || title !== 'New Hoge Panda' || fed < 1 || !fed }>Grow To Young 🐼</button>
      <button id='adult_btn' onClick={growToAdult} disabled={!isAuthenticated || !id 
        || title !== 'Young Hoge Panda' || fed < 3 || !fed}>Grow To Adult 🐼</button>
      <br></br>
      <button id='fed_btn' onClick={getTimesFed} disabled={!isAuthenticated || !id}>Times Fed 🀤</button>
      <input className="inp-border a2" id='times_fed' type='number' name='fed' value={fed} disabled />
      <br></br>
      <input className="inp-border a2" id="input_bamboo" type="number" name="bamboo" onChange={handleBambooChange} value={bamboo} />
      <button id="bamboo_btn" onClick={createBamboo} disabled={!isAuthenticated || !bamboo || parseInt(bamboo) < 1}>Get Bamboo 🀤</button>
      <br></br>
      <input className="inp-border a2" id='input_feed' type='number' name='feed' onChange={handleFeedChange} value={feed}/>
      <button id='feed_btn' onClick={feedBamboo} disabled={!isAuthenticated || !feed || parseInt(feed) < 1 || parseInt(id) < 1}>Feed 🐼 Bamboo 🀤</button>
      <p><br></br></p>
      <ReactPlayer playing url={animate} width='100%' controls={true} loop={true} />
    </div>
  )
}

export default App
