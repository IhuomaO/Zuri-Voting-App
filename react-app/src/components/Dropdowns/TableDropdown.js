import React from "react";
import { createPopper } from "@popperjs/core";

const NotificationDropdown = () => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "left-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  return (
    <>
      <a
        className="text-blueGray-500 py-1 px-3"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <i className="fas fa-ellipsis-v"></i>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 py-2 list-none pr-4 text-left rounded shadow-lg min-w-48"
        }
      >
        <button
          className="bg-white text-blueGray-700 active:bg-blueGray-50 text-xs font-bold w-full uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-4 ease-linear transition-all duration-150"
          type="button"
          onClick={(e) => e.preventDefault()}
        >
          <i className="fas fa-start"></i>
          Start
        </button>

        <button
          className="bg-white text-blueGray-700 active:bg-blueGray-50 text-xs font-bold w-full uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-4 ease-linear transition-all duration-150 block"
          type="button"
          onClick={(e) => e.preventDefault()}
        >
          <i className="fas fa-start"></i>
          End
        </button>
        <button
          className="bg-white text-blueGray-700 active:bg-blueGray-50 text-xs font-bold w-full uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-4 ease-linear transition-all duration-150 block"
          type="button"
          onClick={(e) => e.preventDefault()}
        >
          <i className="fas fa-start"></i>
          Collate
        </button>
      </div>
    </>
  );
};

export default NotificationDropdown;
