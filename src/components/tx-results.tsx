import { useState } from 'react'
import { useApiContract } from "react-moralis";
import { CONTRACT_ABI } from "../abi";

//make drop down for abi functions


export const TxResults = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const { runContractFunction, data, error, isLoading, isFetching } = useApiContract(
    {
      address: '0x5Ea0333638b035BB911eD77F101C2bea979A2843',
      functionName: 'getTimesFed',
      abi: CONTRACT_ABI,
      params: 1
    })
    if (error){setErrorMessage(error.message)}
  return (<div>
    {errorMessage && <p className="error"> {errorMessage} </p>}
    <button onClick={() => runContractFunction()} disabled={isFetching}>Run contract function</button>
    {data && <pre> {JSON.stringify(data)} </pre>}
  </div>)
}
 
