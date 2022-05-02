import { useStoreContext } from "context/IndigoVotingContext";
import { IndigoVotingContext } from "context/IndigoVotingContext";
import React from "react";
import { useState, useContext } from "react";
// import useForm from "Hooks/useForm";

function Register() {
  const [electionChange, setElectionChange] = useState({})
  const [candidateChange, setCandidateChange] = useState({})
  // const [candidateChange, setCandidateChange] = useState({})
  const { store } = useStoreContext()
  const { contract } = store
  // const { isOwner, isStakeHolder, isChairman, isLoading, isTeacher, isStudent, isBODMember, chairman } = contractDetails


  const handleChange = (e) => {
    let { name, value, form } = e.target

    if (form.name === 'create-candidate') {
      if (name === 'electionID') value = Number(value)
      if (name === 'candidateAddress') value = value.toLowerCase()
      console.log(value);
      setCandidateChange((prev) => ({ ...prev, [name]: value }))
    } else {
      // if (name === 'participants') value = value.replace(/ /g, '').split(',')
      setElectionChange((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (e.target.name === 'create-election') {
        console.log('Adding Election');
        const electionChangeArr = Object.values(electionChange)
        const res = await contract.setElectionDetails(...electionChangeArr)
        console.log(res);
        setElectionChange({})
      }
      if (e.target.name === 'create-candidate') {
        console.log('Adding Candidate');
        const candidateChangeArr = Object.values(candidateChange)
        const res = await contract.addCandidate(...candidateChangeArr)
        console.log(res);
        setCandidateChange({})
      }

    } catch (error) {
      console.log(error)
    }
  }


  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h6 className="text-blueGray-500 text-sm font-bold uppercase">
                Create Election
              </h6>
            </div>
          </div>
          <div className="flex-auto px-4 lg:px-4 py-10 pt-0">
            <form name='create-election' onSubmit={handleSubmit}>
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mt-6 mb-2"
                  htmlFor="grid-password"
                >
                  Election Name
                </label>
                <input
                  name='electionName'
                  type="text"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Name"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mt-6 mb-2"
                  htmlFor="grid-password"
                >
                  Position
                </label>
                <input
                  name='_electivePosition'
                  type="text"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Position"
                  onChange={handleChange}
                  required

                />
              </div>


              {/* <div className="relative w-full mb-3">
                <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="status"
                >
                Status
                </label>
                <input
                name='status'
                  type="number"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Status"
                  required
                  onChange={handleChange}
                  />
                  </div>
                  
                  <div className="relative w-full mb-3">
                  <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mt-6 mb-2"
                  htmlFor="grid-password"
                  >
                  Participants
                  </label>
                  <input
                  name='participants'
                  required
                  type="text"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Participants' Address(es) Separated by commas (,)"
                  onChange={handleChange}
                  
                  />
                </div> */}


              <div className="text-center mt-6">
                <button
                  className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  type="submit"
                >
                  Create Election
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>


      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h6 className="text-blueGray-500 text-sm font-bold uppercase">
                Create Candidate
              </h6>
            </div>
          </div>
          <div className="flex-auto px-4 lg:px-4 py-10 pt-0">
            <form name='create-candidate' onSubmit={handleSubmit}>
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mt-6 mb-2"
                  htmlFor="electionID"
                >
                  Election ID
                </label>
                <input
                  name='electionID'
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
                  Candidate Address
                </label>
                <input
                  name='candidateAddress'
                  type="text"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Type in the Candidate's address"
                  onChange={handleChange}

                  required
                />
              </div>

              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mt-6 mb-2"
                  htmlFor="grid-password"
                >
                  Name of Candidate
                </label>
                <input
                  name='candidateName'
                  type="text"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Type in the name of the candidate"
                  required
                  onChange={handleChange}

                />
              </div>


              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="status"
                >
                  Slogan
                </label>
                <input
                  name='slogan'
                  required
                  type="text"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Slogan of Candidate"
                  onChange={handleChange}
                />
              </div>

              <div className="text-center mt-6">
                <button
                  className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  type="submit"

                >
                  Create Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>


    </>
  );
}

export default Register;
