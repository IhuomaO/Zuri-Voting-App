import React from 'react'

import { useStoreContext } from "context/IndigoVotingContext";
import { useState, useContext } from "react";

const OtherForms = () => {

  const [voteChange, setVoteChange] = useState({})
  const [startChange, setStartChange] = useState({})
  const [stopChange, setStopChange] = useState({})
  const { store, setStoreContext } = useStoreContext()
  const { contract, contractDetails } = store


  // const { isOwner, isStakeHolder, isChairman, isLoading, isTeacher, isStudent, isBODMember, chairman } = contractDetails


  const handleChange = (e) => {
    let { name, value, form } = e.target

    if (form.name === 'vote-candidate') setVoteChange((prev) => ({ ...prev, [name]: value }))
    if (form.name === 'start-election') setStartChange((prev) => ({ ...prev, [name]: value }))
    if (form.name === 'end-election') setStopChange((prev) => ({ ...prev, [name]: value }))


    console.log(voteChange, startChange, stopChange);
  }

  const handleVoteSubmit = async (e) => {
    e.preventDefault()
    const ChangeArr = Object.values(voteChange)
    console.log(ChangeArr);
    const res = await contract.castVote(...ChangeArr)
    console.log(res);
  }
  const handleStartSubmit = async (e) => {
    e.preventDefault()
    const ChangeArr = Object.values(startChange)
    console.log(ChangeArr);
    const res = await contract.startElection(...ChangeArr)
    console.log(res);
  }
  const handleEndSubmit = async (e) => {
    e.preventDefault()
    setStoreContext({ voted: true })
    const ChangeArr = Object.values(stopChange)
    console.log(...ChangeArr);
    const res = await contract.endElection(...ChangeArr)
    console.log(res);
  }


  return (
    <div className='py-20'>

      {/* Vote In Election */}
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h6 className="text-blueGray-500 text-sm font-bold uppercase">
                Vote
              </h6>
            </div>
          </div>
          <div className="flex-auto px-4 lg:px-4 py-10 pt-0">
            <form name='vote-candidate' onSubmit={handleVoteSubmit}>
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mt-6 mb-2"
                  htmlFor="electionID"
                >
                  Election ID
                </label>
                <input
                  name='voteElectionID'
                  type="number"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Type in the Election ID"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mt-6 mb-2"
                  htmlFor="grid-password"
                >
                  Candidate ID
                </label>
                <input
                  name='voteCandidateID'
                  type="text"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Type in the Candidate's address"
                  onChange={handleChange}

                  required
                />
              </div>

              <button
                className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                type="submit"
              >
                Vote
              </button>

            </form>
          </div>
        </div>

      </div>


      {/* Start Election */}
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h6 className="text-blueGray-500 text-sm font-bold uppercase">
                Start Election
              </h6>
            </div>
          </div>
          <div className="flex-auto px-4 lg:px-4 py-10 pt-0">
            <form name='start-election' onSubmit={handleStartSubmit}>
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mt-6 mb-2"
                  htmlFor="electionID"
                >
                  Election ID
                </label>
                <input
                  name='StartElectionID'
                  type="number"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Type in the Election ID"
                  onChange={handleChange}

                  required
                />
              </div>

              <button
                className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                type="submit"
              >
                Start Election
              </button>

            </form>
          </div>
        </div>
      </div>


      {/* End Election */}
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h6 className="text-blueGray-500 text-sm font-bold uppercase">
                End Election
              </h6>
            </div>
          </div>
          <div className="flex-auto px-4 lg:px-4 py-10 pt-0">
            <form name='end-election' onSubmit={handleEndSubmit}>
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mt-6 mb-2"
                  htmlFor="electionID"
                >
                  Election ID
                </label>
                <input
                  name='endElectionID'
                  type="text"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Type in the Election ID"
                  onChange={handleChange}

                  required
                />
              </div>

              <button
                className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                type="submit"
              >
                End Election
              </button>

            </form>
          </div>
        </div>
      </div>

    </div >
  )
}

export default OtherForms