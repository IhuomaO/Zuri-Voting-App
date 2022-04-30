import OtherForms from "../../components/Forms/OtherForms";
import { useStoreContext } from "context/IndigoVotingContext";
import React from "react";
import { BallTriangle, Oval } from "react-loader-spinner";

// components

// import CardSettings from "components/Cards/CardSettings.js";
// import CardProfile from "components/Cards/CardProfile.js";
import Register from "../../components/Forms/Register";
import RegisterUser from "../../components/Forms/RegisterUser";


export default function Settings() {
  const { store } = useStoreContext()
  const { contractDetails } = store
  const { isOwner, isStakeHolder, isChairman, isLoading, isTeacher, isStudent, isBODMember } = contractDetails
  console.log(store);
  // const isOwner = currentAccount === owner
  return isLoading ?
    <div className=" flex justify-center items-center h-96 relative z-10">
      <Oval color="#0284c7" height={40} width={40} />
    </div>
    :
    <>
      <div className="flex justify-center flex-wrap mt-4 relative z-10">
        {isOwner &&
          <div className="w-full xl:w-4/12 px-4">
            <RegisterUser />
          </div>}

        {(isTeacher || isChairman || isBODMember) &&
          < div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
            <Register />
          </div>}
      </div>
      <div className="text-4xl text-center uppercase flex justify-center font-bold relative z-10">
        You are {" "}
        {!isStakeHolder && !isOwner && !isChairman && ' not a Stakeholder'}
        {isChairman && ' The Chairman'}
        {/* {isOwner && ' The Admin'} */}
        {isTeacher && ' a Teacher'}
        {isStudent && <div className="h-96 px-4">{" "} a Student</div>}
      </div>


      <div>
        <OtherForms />
      </div>
    </>

}
