import React, { useState } from 'react'
// import { IndigoVotingContext } from 'context/IndigoVotingContext'

const AdminResponsibilities = () => {
  // const { contract } = useContext(IndigoVotingContext)
  const [inputChange, setInputChange] = useState({})


  const handleChange = (e) => {
    console.log(e);
    let { name, value, form } = e.target
    e.preventDefault();
    if (form.name === 'create-candidate') {
      setInputChange((prev) => ({ ...prev, [name]: value }))
    }
  }


  const handleSubmit = async (e) => {
    // let { address, role } = inputChange
    // e.preventDefault();
    // try {
    //   switch (role) {
    //     case 'chairman':
    //       const res1 = await contract.setChairman(address)
    //       console.log(res1);
    //       break;
    //     case 'BOD':
    //       const res2 = await contract.setBOD(address)
    //       console.log(res2);
    //       break;
    //     case 'teacher':
    //       const res3 = await contract.setElectionDetails(address)
    //       console.log(res3);
    //       break;
    //     case 'student':
    //       const res4 = await contract.setElectionDetails(address)
    //       console.log(res4);
    //       break;
    //     default:
    //       break;
    //   }

    // } catch (error) {
    //   console.log(error)
    // }
  }



  return (
    <div>

      <div className="w-full flex relative z-30">

        <form id='create-stakeholder' name='create-stakeholder' onSubmit={handleSubmit} className=" flex flex-col bg-white w-80 h-96 rounded-md shadow-md p-7 space-y-3 ">
          <div className="flex justify-between items-center">
            <h3 className="font-bold my-3">Create Stakeholder</h3>
            <button
              className="shadow-2xl bg-lightBlue-600 text-white active:bg-lightBlue-500 text-xs font-bold uppercase px-2 h-7 rounded  outline-none ease-linear transition-all duration-150 cursor-pointer"
              type="submit"
            >
              Create +
            </button>
          </div>
          <div>
            <label className="font-semibold" htmlFor="address">Stakeholder Address </label>
            <div><input name="address" id="address" className="font-semibold text-sm rounded-md h-7 w-full" type="text" onChange={handleChange} /></div>
          </div>
          <div>
            <label className="font-semibold" htmlFor="role"> Role </label>
            <div><select name="role" id="role" onChange={handleChange} defaultValue='' className="font-semibold capitalize px-2 text-sm rounded-md h-7 p-0 w-full " >
              <option className="capitalize" value="">Set Role</option>
              <option className="capitalize" value="chairman">chairman</option>
              <option className="capitalize" value="BOD">Member, Board of Director</option>
              <option className="capitalize" value="teacher">teacher</option>
              <option className="capitalize" value="student">student</option>
            </select></div>
          </div>

          <div>
          </div>
        </form>


      </div>


    </div>
  )
}

export default AdminResponsibilities