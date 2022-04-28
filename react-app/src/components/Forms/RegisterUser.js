import { useStoreContext } from 'context/IndigoVotingContext';
import { IndigoVotingContext } from 'context/IndigoVotingContext';
import React, { useState, useContext } from 'react'
// import { IndigoVotingContext } from 'context/IndigoVotingContext'

const RegisterUser = () => {
  const { store } = useStoreContext()
  const { contract } = store

  const [inputChange, setInputChange] = useState({})


  const handleChange = (e) => {
    let { name, value, form } = e.target
    e.preventDefault();
    setInputChange((prev) => ({ ...prev, [name]: value }))

  }
  console.log(inputChange);

  const handleSubmit = async (e) => {
    let { address, role } = inputChange
    e.preventDefault();
    try {
      switch (role) {
        case 'chairman':
          console.log('active');
          const res1 = await contract.setChairman(address)
          console.log(res1);
          break;
        case 'BOD':
          const res2 = await contract.setBOD(address)
          console.log(res2);
          break;
        case 'teacher':
          const res3 = await contract.setTeacher(address)
          console.log(res3);
          break;
        case 'student':
          const res4 = await contract.setStudent(address)
          console.log(res4);
          break;
        default:
          break;
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
            <h6 className="text-blueGray-500 text-sm font-bold uppercase">
              Create Stakeholder
            </h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-4 py-10 pt-0">
          <form onSubmit={handleSubmit}>
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mt-6 mb-2"
                htmlFor="userName"
              >
                Address
              </label>
              <input
                type="text"
                id="userName"
                name="address"
                onChange={handleChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Name"
              />
            </div>

            <div className="relative w-full mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="optionType">
                Role
              </label>
              <div><select name="role" id="role" onChange={handleChange} defaultValue='' className="form-select form-select-sm appearance-none block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" >
                <option className="capitalize" value="">Set Role</option>
                <option className="capitalize" value="chairman">chairman</option>
                <option className="capitalize" value="BOD">Member, Board of Director</option>
                <option className="capitalize" value="teacher">teacher</option>
                <option className="capitalize" value="student">student</option>
              </select></div>
            </div>

            <div className="text-center mt-6">
              <button
                className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                type="submit"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;
