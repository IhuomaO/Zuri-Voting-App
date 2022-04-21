// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    /**Global Variables and arrays
    */ 
    address public chairman;
    address[] public teachers;
    address[] public BOD;
    address[] public students;
    address[] public stakeholders;
    uint256 candidateCount;
    uint256 voterCount;
    bool votingState;

/**
@notice mappings for access control
*/ 
mapping (address=>bool) public isTeacher;
mapping (address=>bool) public isBODMember;
mapping (address=>bool) public isStudent;
mapping (address=>bool) public isStakeHolder;

  /**
     * @notice events emitted for front-end
     */ 
    event TeacherSet(address [] _teachers);
    event TeacherRemoved(address [] _teachers);
    event StudentSet(address [] _students);
    event StudentRemoved(address [] _students);
    event BODSet(address [] _BODs);
    event BODRemoved(address [] _BODs);

/**
@notice Modifier for only Chairman access
*/ 

     modifier onlyChairman {
        // Modifier for only chairman access
        require(msg.sender == chairman,"You're not the Chairman!");
        _;
    }
/**
@notice Modifier for only Chairman, BOD or teacher access
*/ 
     modifier onlyTrustee {
        require(msg.sender == chairman || isBODMember[msg.sender] || isTeacher[msg.sender], "You're not a Trustee Member");
        _;
    }
  /**
@notice Modifier for only stakeHolders
*/ 
    modifier onlyStakeHolder {
        require(isStakeHolder[msg.sender], "You're not a StakeHolder");
        _;
    }
  /**
@notice Modifier to ensure voting has started
*/ 
    modifier VotingActive {
        require(votingState, "Voting not allowed.");
        _;
    }
     /**
@notice Modifier to ensure voting has started
*/ 
function setChairman(address _chairman) public onlyOwner {
    chairman = _chairman;
}
  /**
    @notice A method to set an address(es) as a Teacher(s)
    @param _teachers addresses to set as Teachers.
    */
    function setTeacher(address [] memory _teachers) public onlyChairman {
        require(_teachers.length <= 50, "Can only set a max of 50 teachers at a time");
        for(uint i = 0; i < _teachers.length; i++) {
            teachers.push(_teachers[i]);
            stakeholders.push(_teachers[i]);
            isTeacher[_teachers[i]]= true;
            isStakeHolder[_teachers[i]]= true;
        }
        emit TeacherSet(_teachers);
    }
 /**
    @notice A method to remove an address(es) as a Teacher(s)
    @param _teachers addresses to remove as Teachers.
    */
    function RemoveTeacher(address [] memory _teachers) public onlyChairman {
        require(_teachers.length <= 50, "Can only remove a max of 50 teachers at a time");
        for(uint i = 0; i < _teachers.length; i++) {
          uint index = find(_teachers[i], teachers);
            teachers[index] = teachers[teachers.length - 1];
            teachers.pop();
           uint secondIndex = find(_teachers[i], stakeholders); 
            stakeholders[secondIndex] = stakeholders[stakeholders.length - 1];
            stakeholders.pop();
            isTeacher[_teachers[i]]= false;
            isStakeHolder[_teachers[i]]= false;
        }
        emit TeacherRemoved(_teachers);
    }
  /**
    @notice A method to set an address(es) as a Student(s)
    @param _students addresses to set as Teachers.
    */
    function setStudent(address [] memory _students) public onlyTrustee {
        require(_students.length <= 50, "Can only set a max of 50 students at a time");
        for(uint i = 0; i < _students.length; i++) {
            students.push(_students[i]);
            stakeholders.push(_students[i]);
            isStudent[_students[i]]= true;
            isStakeHolder[_students[i]]= true;
        }
        emit StudentSet(_students);
    }
 /**
    @notice A method to remove an address(es) as a student(s)
    @param _students addresses to remove as students.
    */
    function RemoveStudent(address [] memory _students) public onlyTrustee {
        require(_students.length <= 50, "Can only remove a max of 50 students at a time");
        for(uint i = 0; i < _students.length; i++) {
          uint index = find(_students[i], students);
            students[index] = students[students.length - 1];
            students.pop();
           uint secondIndex = find(_students[i], stakeholders); 
            stakeholders[secondIndex] = stakeholders[stakeholders.length - 1];
            stakeholders.pop();
            isStudent[_students[i]]= false;
            isStakeHolder[_students[i]]= false;
        }
        emit StudentRemoved(_students);
    }

  /**
    @notice A method to set an address(es) as a BOD(s)
    @param _BOD addresses to set as BODs.
    */
    function setBOD(address [] memory _BOD) public onlyChairman {
        require(_BOD.length <= 50, "Can only set a max of 50 members of the Board of Directors at a time");
        for(uint i = 0; i < _BOD.length; i++) {
            BOD.push(_BOD[i]);
            stakeholders.push(_BOD[i]);
            isBODMember[_BOD[i]]= true;
            isStakeHolder[_BOD[i]]= true;
        }
        emit BODSet(_BOD);
    }
 /**
    @notice A method to remove an address(es) as a BOD(s)
    @param _BOD addresses to remove as BODs.
    */
    function RemoveBOD(address [] memory _BOD) public onlyChairman {
        require(_BOD.length <= 50, "Can only remove a max of 50 BODs at a time");
        for(uint i = 0; i < _BOD.length; i++) {
          uint index = find(_BOD[i], BOD);
            BOD[index] = BOD[BOD.length - 1];
            BOD.pop();
           uint secondIndex = find(_BOD[i], stakeholders); 
            stakeholders[secondIndex] = stakeholders[stakeholders.length - 1];
            stakeholders.pop();
            isBODMember[_BOD[i]]= false;
            isStakeHolder[_BOD[i]]= false;
        }
        emit BODRemoved(_BOD);
    }





 /**
    @notice A method to iterate through an array and find the index of an element
    @param addr element to find it's index
    @param _array array to loop through
    */
       function find(address addr, address[] memory _array) public pure returns(uint){
        uint i = 0;
        while (_array[i] != addr) {
            i++;
        }
        return i;
    }
}