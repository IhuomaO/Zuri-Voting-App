import React from "react";
import { useState } from "react";
import { contract } from "context/IndigoVotingContext";
// import useForm from "Hooks/useForm";

function Register() {
  const [onChange, setElectionChange] = useState({})
  const [candidateChange, setCandidateChange] = useState({})


  const handleElectionChange = (e) => {
    console.log(e);
    let { name, value, form } = e.target
    e.preventDefault();
    if (form.name === 'create-candidate') {
      setCandidateChange((prev) => ({ ...prev, [name]: value }))
    } else {
      if (name === 'participants') value = value.replace(/ /g, '').split(',')
      setElectionChange((prev) => ({ ...prev, [name]: value }))
    }
  }

  const submitElectionChange = async (e) => {
    e.preventDefault();
    try {
      if (e.target.name === 'create-candidate') {
        const res = await contract.addCandidate(candidateChange)
        console.log(res);
      } else {
        const res = await contract.setElectionDetails()
        console.log(res);
      }

    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h6 className="text-blueGray-500 text-sm font-bold">
              Create election
            </h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-4 py-10 pt-0">
          <form>
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mt-6 mb-2"
                htmlFor="grid-password"
              >
                Position
              </label>
              <input
                type="text"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Position"
              />
            </div>

            {/* <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Category
              </label>
              <input
                type="email"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="ca"
              />
            </div> */}
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="category"
              >
                Category
              </label>
              <select
                id="category"
                class="form-select form-select-sm appearance-none block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat
    border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                aria-label=".form-select-sm example"
                name="category"
                onChange={onChange}
                value={values.category}
              >
                <option selected>Choose category</option>
                <option value="students">Students</option>
                <option value="teachers">Teachers</option>
                <option value="boardOfDirectors">Board of Directors</option>
              </select>
            </div>
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="aspirants"
              >
                Aspirants
              </label>
              <select
                id="aspirants"
                class="form-select form-select-sm appearance-none block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat
    border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                aria-label=".form-select-sm example"
                name="aspirants"
                onChange={onChange}
                value={values.aspirants}
              >
                <option selected>Choose aspirants</option>
                { }
              </select>
            </div>
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="status"
              >
                Status
              </label>
              <input
                type="status"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Status"
              />
            </div>

            <div className="text-center mt-6">
              <button
                className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                type="button"
              >
                Create Election
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
