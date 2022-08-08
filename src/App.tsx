import React, { useEffect, useState} from 'react'
import './App.css'
import { CONTRACT_ABI } from './abi'
import { useMoralis, useChain } from 'react-moralis'
import Moralis from 'moralis'
import ReactPlayer from 'react-player'
import { SuccessPopup, ErrorPopup, ExecutedPopup } from './components/result-popups'


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
    setBamboo(event.target.value)
  }
  const handleFeedChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setFeed(event.target.value)
  }
  const { switchNetwork, chainId, chain } = useChain();
  const { Moralis, authenticate, isAuthenticated, isAuthenticating, user, logout, isWeb3Enabled } = useMoralis()
  const ethers = Moralis.web3Library


  useEffect(() => {
    if (isAuthenticated){
      setUserAddress(user!.get('ethAddress'))
      ethersContract()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled, chain])

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
    console.log("Logging out DONE")
  }

  const exeFunc = async (options: Moralis.ExecuteFunctionOptions) => {
    try{
      await Moralis.enableWeb3()
      const result = await Moralis.executeFunction(options)
      const json = JSON.parse(JSON.stringify(result))
      return json
    } catch(e) {
      //console.log('Error', e)
      const re = await JSON.parse(JSON.stringify(e))
      return { "Execute Error": re.message }
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
      console.log(error)
      clearData()
      return
    })
    await getTokenName()
    await getTimesFed()
  }

  const getTimesFed = async () => {
    const HogePandaContract = new ethers.Contract(hogePandasAddress, CONTRACT_ABI, await Moralis.enableWeb3())
    const fed = await HogePandaContract.getTimesFed(id)
    setFed(parseInt(fed._hex, 16))
  }

  const getTokenName = async () => {
    const HogePandaContract = new ethers.Contract(hogePandasAddress, CONTRACT_ABI, await Moralis.enableWeb3())
    const name = await HogePandaContract.getTokenName(id)
    setName(name)
    console.log(name)
  }

  const newPanda = async () => {
    if (!userAddress){return}
    const HogePandaContract = new ethers.Contract(hogePandasAddress, CONTRACT_ABI, await Moralis.enableWeb3())
    const result = await HogePandaContract.getTokenName({value: ethers.utils.parseEther('0.025'), account: userAddress, nft_name: name })
    console.log(result)
  }
  
  const createBamboo = async () => {
    if (!userAddress){return}
    const price = ethers.utils.parseEther((parseInt(bamboo) * 0.01).toString())
    const HogePandaContract = new ethers.Contract(hogePandasAddress, CONTRACT_ABI, await Moralis.enableWeb3())
    const result = await HogePandaContract.createBamboo({value: price, account: userAddress, nft_name: name })
    console.log(result)
  }

  const feedBamboo = async () => {
    if (!userAddress){return}
    const price = ethers.utils.parseEther((parseInt(feed) * 0.01).toString())
    const HogePandaContract = new ethers.Contract(hogePandasAddress, CONTRACT_ABI, await Moralis.enableWeb3())
    const result = await HogePandaContract.feedBamboo({value: price, account: userAddress, nft_id: id, amount: feed })
    const fed = await HogePandaContract.getTimesFed(id)
    setFed(parseInt(fed._hex, 16))
    console.log(result)
  }
  
  const growToYoung = async () => {
    if (!userAddress){return}
    const HogePandaContract = new ethers.Contract(hogePandasAddress, CONTRACT_ABI, await Moralis.enableWeb3())
    const result = await HogePandaContract.growToYoung({value: ethers.utils.parseEther('0.05'), account: userAddress, nft_id: id})
    console.log(result)
  }

  const growToAdult = async () => {
    if (!userAddress){return}
    const HogePandaContract = new ethers.Contract(hogePandasAddress, CONTRACT_ABI, await Moralis.enableWeb3())
    const result = await HogePandaContract.growToAdult({value: ethers.utils.parseEther('0.1'), account: userAddress, nft_id: id})
    console.log(result)  
  }

  return (
    <div>
      <h1>🀤🐼HogePandas🐼🀤</h1>
      <button className='headerBotton' id='login_btn' onClick={login} disabled={isAuthenticated || isAuthenticating}>Moralis Metamask Login</button>
      <button id='logout_btn' onClick={logOut} disabled={!isAuthenticated}>Logout</button>
      <div id='address_div' >{userAddress}</div>
      <p></p>
      <button id='clear_btn' onClick={clearData} >Clear Fields</button>
      &emsp;
      <button id='data_btn' onClick={getTokenData} disabled={!isAuthenticated || !id || parseInt(id) < 0}>Fetch Token Data</button>
      <br></br>
      <label> Token ID: </label>
      <input id='input_id' type='number' name='id' onChange={handleIdChange} value={id} />
      <br></br>
      <label> Name: </label>
      <input id='input_name' type='text' name='name' onChange={handleNameChange} value={name} autoFocus/>
      <button id='panda_btn' onClick={newPanda} disabled={!isAuthenticated || !name || parseInt(id) > -1 }>New HogePanda 🐼</button>
      <br></br>
      <input id='input_title' type='text' name='title' value={title} disabled />
      <input id='input_description' type='text' name='description' value={description} disabled />
      <p></p>
      <button id='young_btn' onClick={growToYoung} disabled={!isAuthenticated || !id 
        || title !== 'New Hoge Panda' || fed < 1 || !fed }>Grow To Young 🐼</button>
      <button id='adult_btn' onClick={growToAdult} disabled={!isAuthenticated || !id 
        || title !== 'Young Hoge Panda' || fed < 3 || !fed}>Grow To Adult 🐼</button>
      <br></br>
      <button id='fed_btn' onClick={getTimesFed} disabled={!isAuthenticated || !id}>Times Fed 🀤</button>
      <input id='times_fed' type='number' name='fed' value={fed} disabled />
      <br></br>
      <input id='input_bamboo' type='number' name='bamboo' onChange={handleBambooChange} value={bamboo} />
      <button id='bamboo_btn' onClick={createBamboo} disabled={!isAuthenticated || !bamboo}>Get Bamboo 🀤</button>
      <br></br>
      <input id='input_feed' type='number' name='feed' onChange={handleFeedChange} value={feed}/>
      <button id='feed_btn' onClick={feedBamboo} disabled={!isAuthenticated || !feed || !id}>Feed 🐼 Bamboo 🀤</button>
      <p><br></br></p>
      <ReactPlayer playing url={animate} height='100%' controls={true} loop={true} />
    </div>
  )
}



export default App
