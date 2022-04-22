import useForm from "Hooks/useForm";
import React from "react";

function RegisterUser() {


  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h6 className="text-blueGray-500 text-sm font-bold">
              Sign up user
            </h6>
          </div>
        </div>
        <div className="flex-auto px-4 lg:px-4 py-10 pt-0">
          <form>
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mt-6 mb-2"
                htmlFor="userName"
              >
                Name
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                onChange={onChange}
                value={values.userName}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Name"
              />
            </div>

            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="optionType"
              >
                Option type
              </label>
              <select
                id="optionType"
                class="form-select form-select-sm appearance-none block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat
    border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                aria-label=".form-select-sm example"
                name="optionType"
                onChange={onChange}
                value={values.optionType}
              >
                <option selected>Choose option</option>
                <option value="single">Single</option>
                <option value="multiple">Multiple</option>
              </select>
            </div>
            {values.optionType === "single" ? (
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="address"
                >
                  Address
                </label>
                <input
                  type="text"
                  onChange={onChange}
                  value={values.address}
                  name="address"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Address"
                />
              </div>
            ) : values.optionType === "multiple" ? (
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="csv"
                >
                  Pick your file
                </label>
                <input
                  type="file"
                  accept=".csv, xlsx"
                  onChange={onChange}
                  value={values.multiple}
                  name="csv"
                  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Batch uploads"
                />
              </div>
            ) : null}

            <div className="text-center mt-6">
              <button
                className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                type="button"
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
