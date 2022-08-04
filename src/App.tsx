import React, { useEffect, useState} from 'react'
//import logo from './logo.svg'
import './App.css'
import { CONTRACT_ABI } from './abi'
import { useMoralis } from 'react-moralis'
import Moralis from 'moralis/types'
import ReactPlayer from 'react-player'

function App() {
  const [name, setName] = useState('')
  const [id, setId] = useState('')
  const [bamboo, setBamboo] = useState('')
  const [feed, setFeed] = useState('')
  const [fed, setFed] = useState(-1)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  //const [image, setImage] = useState('')
  const [animate, setAnimate] = useState('')
  const [userAddress, setUserAddress] = useState('')
  //const [hogeAddress, setHogeAddress] = useState('0xfad45e47083e4607302aa43c65fb3106f1cd7607') //eth chain
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
    setBamboo(event.target.value)
  }
  const handleFeedChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setFeed(event.target.value)
  }

  const { Moralis, authenticate, isAuthenticated, isAuthenticating, user, logout } = useMoralis()
  

  useEffect(() => {
    
    if (isAuthenticated) {
      setUserAddress(user!.get('ethAddress'))
      //console.log(user)
      ethersContract()
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  const ethersContract = async () => {
    const ethers = Moralis.web3Library
    //const hogeContract = new ethers.Contract(hogeAddress, hogeAbiExample, await Moralis.enableWeb3())
    const HogePandaContract = new ethers.Contract(hogePandasAddress, CONTRACT_ABI, await Moralis.enableWeb3())
    //example calls
    const name = await HogePandaContract.name()
    const symbol = await HogePandaContract.symbol()
    console.log(name, '\n', symbol)
  }

  const exeFunc = async (options: Moralis.ExecuteFunctionOptions) => {
    try{
      await Moralis.enableWeb3()
      const result = await Moralis.executeFunction(options)
      const json = JSON.parse(JSON.stringify(result))
      return json
    } catch(e) {
      console.log('Error', e)
      return { 'error': e }
    }
  }

  const clearData = async () => {
    setTitle('')
    setDescription('')
    //setImage('')
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
      await authenticate({signingMessage: 'Log in using Moralis' })
        .then(function (user) {
          if(!user){return}
          setUserAddress(user.get('ethAddress'))
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }

  const logOut = async () => {
    console.log('Logged in as: \n\t',user!.get('ethAddress'))
    await logout()
    setUserAddress('')
    console.log('Logging out DONE')
  }

  const getTokenData = async () => {
    const options = {
      contractAddress: hogePandasAddress,
      functionName: 'getTokenData',
      abi: CONTRACT_ABI,
      params: { nft_id: parseInt(id) }
    }
    const result = await exeFunc(options)
    fetch(result)
    .then(response => response.json())
    .then((jsonData) => {
      const obj = JSON.parse(JSON.stringify(jsonData))
      console.log(obj)
      setTitle(obj.title)
      setDescription(obj.description)
      //setImage(obj.image)
      setAnimate(obj.animation_url)
    })
    .catch((error) => {
      console.log(error)
      clearData()
      return
    })
    await getTokenName()
    await getTimesFed()
  }

  const getTimesFed = async () => {
    const options = {
      contractAddress: hogePandasAddress,
      functionName: 'getTimesFed',
      abi: CONTRACT_ABI,
      params: { nft_id: parseInt(id) }
    }
    const result = await exeFunc(options)
    setFed(parseInt(result.hex, 16))
    console.log(result)
  }

  const getTokenName = async () => {
    const options = {
      contractAddress: hogePandasAddress,
      functionName: 'getTokenName',
      abi: CONTRACT_ABI,
      params: { nft_id: parseInt(id) }
    }
    const result = await exeFunc(options)
    if(result?.error){
      clearData()
    }else {
      setName(result)
      console.log(result)
    }
  }

  const newPanda = async () => {
    if (!userAddress){return}
    const options = {
      contractAddress: hogePandasAddress,
      functionName: 'createHogePanda',
      abi: CONTRACT_ABI,
      msgValue: Moralis.Units.ETH('0.025'),
      params: { account: userAddress, nft_name: name }
    }
    const result = await exeFunc(options)
    if(result?.error){
      clearData()
    }else {
      console.log(result)
    }
  }
  
  const createBamboo = async () => {
    if (!userAddress){return}
    const price = parseInt(bamboo) * 0.01
    const options = {
      contractAddress: hogePandasAddress,
      functionName: 'createBamboo',
      abi: CONTRACT_ABI,
      msgValue: Moralis.Units.ETH(price),
      params: { account: userAddress, amount: parseInt(bamboo) }
    }
    const result = await exeFunc(options)
    if(result?.error){
      clearData()
    }else {
      console.log(result)
    }
  }

  const feedBamboo = async () => {
    if (!userAddress){return}
    const price = (parseInt(feed) * 0.01)
    const options = {
      contractAddress: hogePandasAddress,
      functionName: 'feedBamboo',
      abi: CONTRACT_ABI,
      msgValue: Moralis.Units.ETH(price),
      params: { account: userAddress, nft_id: parseInt(id), amount: parseInt(feed) }
    }
    const result = await exeFunc(options)
    if(result?.error){
      clearData()
    }else {
      console.log(result)
    }
  }
  
  const growToYoung = async () => {
    if (!userAddress){return}
    const options = {
      contractAddress: hogePandasAddress,
      functionName: 'growToYoung',
      abi: CONTRACT_ABI,
      msgValue: Moralis.Units.ETH('0.05'),
      params: { account: userAddress, nft_id: parseInt(id) }
    }
    const result = await exeFunc(options)
    if(result?.error){
      clearData()
    }else {
      console.log(result)
    }
  }

  const growToAdult = async () => {
    if (!userAddress){return}
    const options = {
      contractAddress: hogePandasAddress,
      functionName: 'growToAdult',
      abi: CONTRACT_ABI,
      msgValue: Moralis.Units.ETH('0.1'),
      params: { account: userAddress, nft_id: parseInt(id) }
    }
    const result = await exeFunc(options)
    if(result?.error){
      clearData()
    }else {
      console.log(result)
    }
  }

  return (
    <div>
      <h1>🀤🐼HogePandas🐼🀤</h1>
      <button className='headerBotton' id='login_btn' onClick={login} disabled={isAuthenticated || isAuthenticating}>Moralis Metamask Login</button>
      <button id='logout_btn' onClick={logOut} disabled={!isAuthenticated}>Logout</button>
      <div id='address_div' >{userAddress}</div>
      <p></p>
      <button id='clear_btn' onClick={clearData} >Clear Fields </button>
      <br></br>
      <label> Token ID: </label>
      <input id='input_id' type='number' name='id' onChange={handleIdChange} value={id} />
      <button id='data_btn' onClick={getTokenData} disabled={!isAuthenticated || !id || parseInt(id) < 0}>Token Data </button>
      <br></br>
      <label> Name: </label>
      <input id='input_name' type='text' name='name' onChange={handleNameChange} value={name} autoFocus/>
      <button id='panda_btn' onClick={newPanda} disabled={!isAuthenticated || !name || parseInt(id) > -1 }>New HogePanda 🐼</button>
      <br></br>
      <input id='input_title' type='text' name='title' value={title} disabled />
      <input id='input_description' type='text' name='description' value={description} disabled />
      <p></p>
      <button id='fed_btn' onClick={getTimesFed} disabled={!isAuthenticated || !id}>Times Fed 🀤</button>
      <input id='times_fed' type='number' name='fed' value={fed} disabled />
      <br></br>
      <input id='input_bamboo' type='number' name='bamboo' onChange={handleBambooChange} value={bamboo} />
      <button id='bamboo_btn' onClick={createBamboo} disabled={!isAuthenticated || !bamboo}>Get Bamboo 🀤</button>
      <br></br>
      <input id='input_feed' type='number' name='feed' onChange={handleFeedChange} value={feed}/>
      <button id='feed_btn' onClick={feedBamboo} disabled={!isAuthenticated || !feed || !id}>Feed 🐼 Bamboo 🀤</button>
      <p></p>
      <button id='young_btn' onClick={growToYoung} disabled={!isAuthenticated || !id 
        || title !== 'New Hoge Panda' || fed < 1 || !fed }>Grow To Young 🐼</button>
      <button id='adult_btn' onClick={growToAdult} disabled={!isAuthenticated || !id 
        || title !== 'Young Hoge Panda' || fed < 3 || !fed}>Grow To Adult 🐼</button>
      <p></p>
      <ReactPlayer playing url={animate} height='100%' controls={true} loop={true} />
    </div>
  )
}



export default App
