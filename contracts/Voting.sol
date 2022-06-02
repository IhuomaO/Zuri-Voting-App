// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {


    /**Global Variables and arrays
    */ 
    address public chairman;
    bool paused;
   
    // Track number of elections to use as electionID's
    uint256 public electionCount;

    /**
    @notice mappings for access control
    */ 
    mapping (address=>bool) public isTeacher;
    mapping (address=>bool) public isBODMember;
    mapping (address=>bool) public isStudent;
    mapping (address=>bool) public isStakeHolder; 

/**
@notice election mappings
*/
    /// @dev mapping to check for an electionID in the candidate struct
    mapping (uint256 => Candidate[]) private candidates;

    /// @notice Public Variable to look up elections' information
    /// @dev mapping to access each election by electionId
    mapping (uint256 => Election) public elections;

    // Double mapping from user address => pollId => user's vote
    mapping (address => mapping (uint => bool)) public hasVotedForElection;

    /// @notice Public Variable to look up stakeholders' addresses
    /// @dev mapping to check for an address in the stakeholder struct
    mapping (address => Stakeholder) public stakeholders; 
 
    ///@notice mapping to release election results to public
    mapping (uint256 => bool) ReleasedResults;
 
        


    

/**
    /// @notice a declaration of different states available for an election
    /// @dev an enum to represent the possible states an election can have.
*/
    enum ElectionStatus {created, ongoingPhase, closedPhase, revealPhase}

    /// @notice a declaration of different roles available to be assigned to stakeholders
    /// @dev an enum to represent the possible roles an address can take.
    enum Role {
        BOD,
        TEACHER,
        STUDENT,
        CHAIRMAN
    } 
    /**
         @notice a way to store details of each stakeholder
         @dev a struct to store the details of each stakeholder
         @param role a variable to store the role of type enum 
         @param name a variable to show the candidate's name during election
    */
    struct Stakeholder {
        Role role;
        string name;  
    } 

    /// @notice a way to store details of each Candidate
    /// @dev a struct to store the details of each Candidate
    struct Candidate {
        address candidateAddress;
        string name;
        string slogan;
        uint256 voteCount;
        uint256 candidateID;
    }

    // Modeling a Election Details
    struct Election {
        string name;
        string electivePosition;
        uint256 candidateCount;
        uint256 totalVotesCommitted;     // Total # of votes casted for the election
        ElectionStatus status; 
        bool votingState;

    }


    /**
    @notice Method to set chairman
    */ 
    function setChairman(address _chairman, string memory _name) public onlyOwner {
        chairman = _chairman;
        Role chairRole = Role.CHAIRMAN;
        stakeholders[_chairman] = Stakeholder(chairRole,_name);
        isStakeHolder[_chairman]=true;
        emit ChairmanSet(_chairman);
    }
    /// @notice create a stakeholder
    /// @dev initialize the stakeholders mapping to roles and push them into their respective arrays
    /// @param _address The address of the impending stakeholder
    /// @param _role parameter taking the input for the role to be assigned to the inputted address
    function createStakeHolder(address _address, uint256 _role, string memory _name)
        public
        onlyChairman
    {
        stakeholders[_address] = Stakeholder(Role(_role),_name); //add stakeholders to the mapping
        if (stakeholders[_address].role == Role(0)) {
            isBODMember[_address]= true;
            isStakeHolder[_address]= true;
            emit BODSet(_address);
        }
        if (stakeholders[_address].role == Role(1)) {
            isTeacher[_address]= true;
            isStakeHolder[_address]= true;
            emit TeacherSet(_address);
        }
        if (stakeholders[_address].role == Role(2)) {
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
                isBODMember[_BOD[i]]= false;
                isStakeHolder[_BOD[i]]= false;
                delete stakeholders[_BOD[i]];
            }
            emit BODRemoved(_BOD);
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
        ElectionStatus _status = ElectionStatus.created;
        electionCount++;
        elections[electionCount] = Election(_name,  _electivePosition, 0, 0, _status, false );
        
     
        emit ElectionCreated(electionCount, _name, _electivePosition);

        return electionCount;
    }


     /**
    @dev Adds a candidate to a poll. 
    @param _electionID is the Id of the election to add candidate to.
    @param _name is Candidate name, short description of option, etc.
    @param _slogan is Candidate Slogan.
     */
    function addCandidate(uint _electionID, address _candidateAddress, string memory _name, string memory _slogan) 
        public 
         onlyTrustee
        NotPaused
    {
        // SafeMath8 also catches this require(), but this allows an error message to be provided
        require(elections[_electionID].candidateCount <= 15, "Can not add more than 15 candidates.");
        require(isStakeHolder[_candidateAddress],"Candidate must be a StakeHolder");
        elections[_electionID].candidateCount++;
        candidates[_electionID].push(Candidate(_candidateAddress, _name, _slogan, 0, elections[_electionID].candidateCount));
        
    }



    // Vote
   
    /**
    @dev Cast votes. Allows users to vote anytime during the ongoingElection
    phase.
    @param _electionID Id of the election to vote in.
     */
    function castVote(uint _electionID, uint _candidateID)public onlyStakeHolder VotingActive(_electionID) {
     require (_candidateID > 0 && _candidateID <= elections[_electionID].candidateCount,"Invalid candidate." );
     require(hasVotedForElection[msg.sender][_electionID] == false,"You have already voted");
        hasVotedForElection[msg.sender][_electionID] = true;
        uint totalVotes = elections[_electionID].totalVotesCommitted;
        totalVotes++;
        elections[_electionID].totalVotesCommitted = totalVotes;
        uint candidateVote = candidates[_electionID][_candidateID].voteCount;
        candidateVote++;
        candidates[_electionID][_candidateID].voteCount = candidateVote;

    }

    ///@notice  Start voting
    function startElection(uint256 _electionID) public onlyChairman {
        elections[_electionID].votingState = true;
        elections[_electionID].status = ElectionStatus.ongoingPhase;
    }

    ///@notice End voting
    function endElection(uint256 _electionID) public onlyChairman {
        elections[_electionID].votingState = false;
        elections[_electionID].status = ElectionStatus.closedPhase;
    }
    ///@notice Reveal voting results
    function RevealElection(uint256 _electionID) public onlyChairman {
        elections[_electionID].status = ElectionStatus.revealPhase;
        ReleasedResults[_electionID] = true;
    }


///@notice A method to reveal the winner of an election
function ViewWinnerofElection(uint _electionID) public view onlyStakeHolder ResultIsOut(_electionID) returns(Candidate memory ){
    Candidate memory Winner;
    uint winningVoteCount = 0;
     for (uint i = 0; i < candidates[_electionID].length; i++) {
            if (candidates[_electionID][i].voteCount > winningVoteCount) {
                    Winner = candidates[_electionID][i];
            }
        }
        return Winner;
}




   

    /**@dev =================MODIFIERS====================
    */
        /**
    @notice Modifier for only Chairman access
    */ 
        modifier onlyChairman {
            // Modifier for only chairman access
            require(msg.sender == chairman,"You're not the Chairman!");
            _;
        }
    /**
    @notice Modifier to check if results of an election has been released
    */ 
        modifier onlyWhenReleased(uint _electionID) {
            require(ReleasedResults[_electionID], "Results not released yet");
            _;
        }
/**
    @notice Modifier to check that contract is not paused
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
        modifier VotingActive(uint _electionID) {
             require (elections[_electionID].votingState == true, "Voting not started yet.");
        _;
        }
    /**
    @notice Modifier to ensure result has been revealed
    */ 
        modifier ResultIsOut(uint _electionID) {
             require ( ReleasedResults[_electionID] == true, "Results not out.");
        _;
        }

    ///@notice =================EVENTS=============================

       /**
    * @notice events emitted for front-end
    */ 
        event ChairmanSet(address _chairman);
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
}
