// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {


    /**Global Variables and arrays
    */ 
    address public chairman;
    address[] public teachers;
    address[] public BODs;
    address[] public students;
    address[] public stakeholdersList;
   // uint256 candidateCount;
    uint256 voterCount;
    bool votingState;
    bool released;
    bool paused;
   

    /// @notice a declaration of different roles available to be assigned to stakeholders
    /// @dev an enum to represent the possible roles an address can take.
    enum Role {
        BOD,
        TEACHER,
        STUDENT,
        CHAIRMAN
    } 

    /// @notice a declaration of different states available for an election
    /// @dev an enum to represent the possible states an election can have.
    enum ElectionStatus {created, ongoingPhase, closedPhase, revealPhase}

    /// @notice a way to store details of each stakeholder
    /// @dev a struct to store the details of each stakeholder
    /// @param role a variable to store the role of type enum 
    /// @param hasVoted a boolean to store whether a person has voted or not 
    /// @param name a variable to show the candidate's name during election
    struct Stakeholder {
        Role role;
        bool hasVoted; 
        string name;  
    } 


    /// @notice a way to store details of each Candidate
    /// @dev a struct to store the details of each Candidate
    /// @param name a variable to show the candidate's name during election
    /// @param slogan a variable to show the candidate's slogan for the election
    /// @param voteCount a variable to show the candidate's votes recieved during election
    struct Candidate {
        address candidateAddress;
        string name;
        string slogan;
        uint32 voteCount;
        uint256 candidateID;
    }

    // Modeling a Election Details
    struct Election {
        string name;
        string electivePosition;
        uint256 candidateCount;
        uint32 totalVotesCommitted;     // Total # of votes casted for the election
       // ElectionStatus status; 
        bool votingState;
      //  mapping (address => bool) approvedVoters;   // Addresses approved
    }

     struct Vote {
        uint32 numVotes;        // Number of votes 
    }

    // Track number of elections to use as electionID's
    uint256 public electionCount;

    // @notice Public Variable to look up elections' candidate(s)
    /// @dev mapping to check for an electionID in the candidate struct
    mapping (uint256 => Candidate) public candidates; // mapping elections to unique candidates of the election

    /// @notice Public Variable to look up elections' information
    /// @dev mapping to access each election by electionId
    mapping (uint256 => Election) public elections;

    // Double mapping from user address => pollId => user's vote
    mapping (address => mapping (uint => Vote)) public votes;

    /// @notice Public Variable to look up stakeholders' addresses
    /// @dev mapping to check for an address in the stakeholder struct
    mapping(address => Stakeholder) public stakeholders; 
 

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
        event TeacherSet(address _teachers);
        event TeacherRemoved(address[] _teachers);
        event StudentSet(address _students);
        event StudentRemoved(address[] _students);
        event BODSet(address  _BODs);
        event BODRemoved(address[] _BODs);


        // @notice this event is emitted when election is created.
        event ElectionCreated(uint256 electionCount, string _name, string _electivePosition);

        // @notice this event is emitted when multiple stakeholders are created.
        event CreateMultipleStakeHolders(string message, uint256 _role);
        

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
    /// @notice create a stakeholder
    /// @dev initialize the stakeholders mapping to roles and push them into their respective arrays
    /// @param _address The address of the impending stakeholder
    /// @param _role parameter taking the input for the role to be assigned to the inputted address
    function createStakeHolder(address _address, uint256 _role, string memory _name)
        public
        onlyChairman
    {
        stakeholders[_address] = Stakeholder(Role(_role), false, _name); //add stakeholders to the mapping
        stakeholdersList.push(_address); // add stakeholder's address to the list of stakeHolders addresses
        if (stakeholders[_address].role == Role(0)) {
            BODs.push(_address);
            isBODMember[_address]= true;
            isStakeHolder[_address]= true;
            emit BODSet(_address);
        }
        if (stakeholders[_address].role == Role(1)) {
            teachers.push(_address);
            isTeacher[_address]= true;
            isStakeHolder[_address]= true;
            emit TeacherSet(_address);
        }
        if (stakeholders[_address].role == Role(2)) {
            students.push(_address);
             isStudent[_address]= true;
             isStakeHolder[_address]= true;
            emit StudentSet(_address);
        }
    }
    /// @notice create multiple stakeholders
    /// @dev use a loop to add an array of addresses into respective roles
    /// @param _addressArray an array of impending stakeholder addresses
    /// @param _role parameter taking the input for the role to be assigned to the inputted address
    function createMultipleStakeHolders(address[] memory _addressArray, uint256 _role, string[] memory _name ) public onlyChairman {
        require(_addressArray.length <= 50, "Can only add a max of 50 stakeholders at a time");
        require(_addressArray.length == _name.length, "The number of addresses and names must tally");
        for (uint256 i = 0; i < _addressArray.length; i++){
            createStakeHolder(_addressArray[i], _role, _name[i]);
        }

        emit CreateMultipleStakeHolders("You just created multiple stakeholders", _role);
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
            uint secondIndex = find(_teachers[i], stakeholdersList); 
                stakeholdersList[secondIndex] = stakeholdersList[stakeholdersList.length - 1];
                stakeholdersList.pop();
                isTeacher[_teachers[i]]= false;
                isStakeHolder[_teachers[i]]= false;
                delete stakeholders[_teachers[i]];
            }
            emit TeacherRemoved(_teachers);
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
            uint secondIndex = find(_students[i], stakeholdersList); 
                stakeholdersList[secondIndex] = stakeholdersList[stakeholdersList.length - 1];
                stakeholdersList.pop();
                isStudent[_students[i]]= false;
                isStakeHolder[_students[i]]= false;
                delete stakeholders[_students[i]];
            }
            emit StudentRemoved(_students);
        }

    /**
        @notice A method to remove an address(es) as a BOD(s)
        @param _BOD addresses to remove as BODs.
        */
        function removeBOD(address [] memory _BOD) public onlyChairman NotPaused{
            require(_BOD.length <= 50, "Can only remove a max of 50 BODs at a time");
            for(uint i = 0; i < _BOD.length; i++) {
            uint index = find(_BOD[i], BODs);
                BODs[index] = BODs[BODs.length - 1];
                BODs.pop();
            uint secondIndex = find(_BOD[i], stakeholdersList); 
                stakeholdersList[secondIndex] = stakeholdersList[stakeholdersList.length - 1];
                stakeholdersList.pop();
                isBODMember[_BOD[i]]= false;
                isStakeHolder[_BOD[i]]= false;
                delete stakeholders[_BOD[i]];
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

     /**
    @dev Adds a candidate to a poll. 
    @param _electionID is the Id of the election to add candidate to.
    @param _name is Candidate name, short description of option, etc.
     */
    function addCandidate(uint _electionID, address _candidateAddress, string memory _name, string memory _slogan) 
        public 
         onlyTrustee
        NotPaused
    {
        // SafeMath8 also catches this require(), but this allows an error message to be provided
        require(elections[_electionID].candidateCount < 15, "Can not add more than 15 candidates.");
        uint256 newCandidateCount = elections[_electionID].candidateCount;
        candidates[newCandidateCount] = Candidate(_candidateAddress, _name, _slogan, 0, newCandidateCount);
        newCandidateCount = newCandidateCount+ 1;
        //elections[_electionID].candidates[newCandidateCount].candidateID = newCandidateCount;

        elections[_electionID].candidateCount = newCandidateCount;
    }


    function setElectionDetails(
        string memory _name,
        string memory _electivePosition
    )
        public
        onlyTrustee // Only students can not add
        NotPaused
        returns(uint256)
    {
        // Create election with provided inputs
        elections[electionCount] = Election(_name,  _electivePosition, 0, 0, false );
        electionCount = electionCount+ 1;
     
        emit ElectionCreated(electionCount, _name, _electivePosition);

        return electionCount;
    }

    
    // Get candidates count
    // function getTotalCandidate() public view returns (uint256) {
    //     // Returns total number of candidates
    //     return candidateCount;
    // }

    // Get voters count
    function getTotalVoter() public view returns (uint256) {
        // Returns total number of voters
        return voterCount;
    }

    // Vote
   
    /**
    @dev Cast votes. Allows users to vote anytime during the ongoingElection
    phase.
    @param _electionID Id of the election to vote in.
    @param _numVotes number of votes committed.
     */
    function castVote(uint _electionID, uint _candidateID, uint32 _numVotes) 
        public 
        onlyStakeHolder
    {

        /* Can vote only one time per election
         */
        require (
            votes[msg.sender][_electionID].numVotes == 0,
            "Can only caste votes once per election."
        );
        require (
            elections[_electionID].votingState == true,
            "Voting has not started yet."
        );
        require (
            _candidateID >= 0 && _candidateID <= elections[_electionID].candidateCount,
            "Vote must be placed for a valid candidate."
        );
        // Commit the vote(s) and adjust totalVotesCommitted
        Vote memory newVote = Vote(uint32(_numVotes));
        votes[msg.sender][_electionID] = newVote;
        elections[_electionID].totalVotesCommitted = elections[_electionID].totalVotesCommitted+1;
        
        uint _voteCount = uint(candidates[_electionID].voteCount);
        _voteCount = _voteCount+1;
        candidates[_electionID].voteCount = uint32(_voteCount);

    }

    // Start voting
    function startElection(uint256 _electionID) public onlyChairman {
        elections[_electionID].votingState = true;
    }

    // End voting
    function endElection(uint256 _electionID) public onlyChairman {
        elections[_electionID].votingState = false;
    }

//   function CurrentWinner() public view onlyTrustee
//             returns (string memory)
//     {
//         Candidate memory winningCandidate;
//         uint winningVoteCount = 0;
//         for (uint i = 0; i < candidates.length; i++) {
//             if (candidates[i].voteCount > winningVoteCount) {
//                 winningCandidate = candidates[i];
//             }
//         }
//     return winningCandidate.name;
//     }
   
}
