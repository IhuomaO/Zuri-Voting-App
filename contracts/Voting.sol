// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    /**Global Variables and arrays
    */ 
    address public chairman;
    address[] public teachers;
    address[] public BOD;
    address[] public students;
    address[] public stakeholders;
    Candidate[] public candidates;
    uint256 candidateCount;
    uint256 voterCount;
    bool votingState;
    bool released;
    bool paused;
   


     // Modeling a candidate
    struct Candidate {
        address candidateAddress;
        uint256 candidateId;
        string name;
        string slogan;
        uint256 voteCount;
    }

    // Modeling a Election Details
    struct ElectionDetails {
        string name;
        string electivePosition;
    }

    ElectionDetails public electionDetails;

    /**
    @notice mappings for access control
    */ 
    mapping (address=>bool) public isTeacher;
    mapping (address=>bool) public isBODMember;
    mapping (address=>bool) public isStudent;
    mapping (address=>bool) public isStakeHolder; 
    mapping(address => bool) public hasVoted;


    mapping(uint256  => Candidate) public candidateDetails;

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
    @notice Modifier to release results
    */ 

        modifier onlyWhenReleased {
            // Modifier for only chairman access
            require(released, "Results not released yet");
            _;
        }
    /**
    @notice Modifier to release results
    */ 

        modifier NotPaused {
            // Modifier for only chairman access
            require(paused == false, "Contract is Paused");
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
        function setTeacher(address [] memory _teachers) public onlyChairman NotPaused {
            require(_teachers.length <= 50, "Can only set a max of 50 teachers at a time");
            for(uint i = 0; i < _teachers.length; i++) {
                require(isTeacher[_teachers[i]] == false);
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
        function removeTeacher(address [] memory _teachers) public onlyChairman NotPaused {
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
        function setStudent(address [] memory _students) public onlyChairman NotPaused{
            require(_students.length <= 50, "Can only set a max of 50 students at a time");
            for(uint i = 0; i < _students.length; i++) {
                 require(isStudent[_students[i]] == false);
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
        function removeStudent(address [] memory _students) public onlyChairman NotPaused{
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
        function setBOD(address [] memory _BOD) public onlyChairman NotPaused {
            require(_BOD.length <= 50, "Can only set a max of 50 members of the Board of Directors at a time");
            for(uint i = 0; i < _BOD.length; i++) {
                 require(isBODMember[_BOD[i]] == false);
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
        function removeBOD(address [] memory _BOD) public onlyChairman NotPaused{
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
//Method to release results
    function ReleaseResults() public onlyChairman NotPaused{
        released = true;
    }
    //Pause contract function
    function PauseContract() public onlyOwner {
        paused = true;
    }
    //Unpuase Contract
    function PlayContract() public onlyOwner {
        paused = false;
    }


    // Adding new candidates
    function addCandidate(address _candidateAddress, string memory _name, string memory _slogan)
        public
        // Only students can not can add
        onlyTrustee
        NotPaused
    {
        Candidate memory newCandidate =
            Candidate({
                candidateAddress: _candidateAddress,
                candidateId: candidateCount,
                name: _name,
                slogan: _slogan,
                voteCount: 0
            });
        candidateDetails[candidateCount] = newCandidate;
        candidates.push(newCandidate);
        candidateCount += 1;
    }


    function setElectionDetails(
        string memory _name,
        string memory _electivePosition
    )
        public
        onlyTrustee // Only students can not add
        NotPaused
    {
        electionDetails = ElectionDetails(
            _name,
            _electivePosition
        );
    }

    
    function getElectionTitle() public view returns (string memory) {
        return electionDetails.name;
    }

    function getElectionPosition() public view returns (string memory) {
        return electionDetails.electivePosition;
    }

    // Get candidates count
    function getTotalCandidate() public view returns (uint256) {
        // Returns total number of candidates
        return candidateCount;
    }

    // Get voters count
    function getTotalVoter() public view returns (uint256) {
        // Returns total number of voters
        return voterCount;
    }

    // Vote
    function vote(uint256 candidateId) public onlyStakeHolder VotingActive {
        require(hasVoted[msg.sender] == false, "You have already voted");
        hasVoted[msg.sender] = true;
        candidateDetails[candidateId].voteCount++;
        candidates[candidateId].voteCount++;
        voterCount++;
    }

    // Start voting
    function startElection() public onlyChairman {
        votingState = true;
    }

    // End voting
    function endElection() public onlyChairman {
        votingState = false;
    }

  function CurrentWinner() public view onlyTrustee
            returns (string memory)
    {
        Candidate memory winningCandidate;
        uint winningVoteCount = 0;
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningCandidate = candidates[i];
            }
        }
    return winningCandidate.name;
    }
   
}
