import { useStoreContext } from "context/IndigoVotingContext";
import React from "react";

// components

// import CardSettings from "components/Cards/CardSettings.js";
// import CardProfile from "components/Cards/CardProfile.js";
import Register from "../../components/Forms/Register";
import RegisterUser from "../../components/Forms/RegisterUser";

export default function Settings() {
  const { store } = useStoreContext()
  const { owner, currentAccount, isTeacher, isStudent, isBODMember, chairman } = store.contractDetails
  console.log(store);
  return (
    <>
      <div className="flex flex-wrap mt-4">
        {owner === currentAccount &&
          <div className="w-full xl:w-4/12 px-4">
            <RegisterUser />
          </div>}

        {(isTeacher || chairman === currentAccount || isStudent || isBODMember) &&
          < div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
            <Register />
          </div>}
      </div>
    </>
  );
}
