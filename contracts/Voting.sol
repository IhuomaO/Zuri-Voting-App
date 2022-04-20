// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Voting is Ownable {
    address public admin;
    address public chairman;
    address[] public teachers;
    address[] public bods;
    address[] public students;
    uint256 public candidateCount;
    uint256 public voterCount;
    bool public start;
    bool public end;

    address[] public stakeholders; // Array of address to store address of stakeholders
    mapping(address => Stakeholder) public stakeholderDetails;

    mapping(address => Candidate) public candidateDetails;

    constructor() public {
        // Initilizing default values
        admin = owner;
        candidateCount = 0;
        voterCount = 0;
        start = false;
        end = false;
    }

    // Modeling a stakeholder
    struct Stakeholder {
        address stakeholderAddress;
        string role;
        bool hasVoted;
    }

     // Modeling a candidate
    struct Candidate {
        address candidateAddress;
        uint256 candidateId;
        string header;
        string slogan;
        uint256 voteCount;
    }

    // Modeling a Election Details
    struct ElectionDetails {
        string electionTitle;
        string organizationTitle;
    }

    ElectionDetails public electionDetails;

    //This function takes a csv file and assignes roles to each address on the csv
    function assignRoles(address[]  _stakeholdersAddress, string memory _role ) public onlyAdmin {
        if ( _role == "Admin"){
              chairman = _stakeholdersAddress;
        }
        if (_role == "BODs"){ 
            //assign roles bods
             chairman = _stakeholdersAddress;
         }
         if (_role == "Teachers"){ 
            //assign roles Teachers
             chairman = _stakeholdersAddress;
         } else {
             //assign roles Students
              chairman = _stakeholdersAddress;
         }
        
    }

    modifier onlyAdmin() {
        // Modifier for only admin access
        require(msg.sender == admin, "You are not system admin");
        _;
    }

     modifier onlyChairman() {
        // Modifier for only chairman access
        require(msg.sender == chairman, "Only the chairman can do this");
        _;
    }

     modifier onlyTrustee() {
        // Modifier for only bods or teacher access
        require(msg.sender == chairman || msg.sender != bods || msg.sender != teachers, "You are not a staff");
        _;
    }
   

    // Adding new candidates
    function addCandidate(address _candidateAddress, string memory _header, string memory _slogan)
        public
        // Only students can not can add
        onlyTrustee
    {
        Candidate memory newCandidate =
            Candidate({
                candidateAddress: _candidateAddress,
                candidateId: candidateCount,
                header: _header,
                slogan: _slogan,
                voteCount: 0
            });
        candidateDetails[candidateCount] = newCandidate;
        candidateCount += 1;
    }


    function setElectionDetails(
        string memory _electionTitle,
        string memory _organizationTitle
    )
        public
        // Only students can not add
        onlyTrustee
    {
        electionDetails = ElectionDetails(
            _electionTitle,
            _organizationTitle
        );
        start = false;
        end = false;
    }

    
    function getElectionTitle() public view returns (string memory) {
        return electionDetails.electionTitle;
    }

    function getOrganizationTitle() public view returns (string memory) {
        return electionDetails.organizationTitle;
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
    function vote(uint256 candidateId) public {
        require(stakeholderDetails[msg.sender].hasVoted == false, "You have already voted");
        require(start == true, "Voting has not started");
        require(end == false, "Voting has ended");
        candidateDetails[candidateId].voteCount += 1;
        stakeholderDetails[msg.sender].hasVoted = true;
    }

    // Start voting
    function startElection() public onlyChairman {
        end = false;
        start = true;
    }

    // End voting
    function endElection() public onlyChairman {
        end = true;
        start = false;
    }

    // Get election start and end values
    function getStart() public view returns (bool) {
        return start;
    }

    function getEnd() public view returns (bool) {
        return end;
    }
}