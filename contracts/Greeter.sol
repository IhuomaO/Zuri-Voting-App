pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Voting is Ownable {
    address public chairman;
    address[] public teachers;
    address[] public bods;
    address[] public students;
    uint256 candidateCount;
    uint256 voterCount;
    bool start;
    bool end;

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

    //This function takes a csv file and assignes roles to each address on the csv
    function assignRoles(address[] _stakeholdersAddress, string memory _role ) public onlyAdmin {
        if ( _role == "Admin"){
              chairman = _address;
        }
        if (_role == "BODs"){ 
            //assign roles bods
         }
         if (_role == "Teachers"){ 
            //assign roles Teachers
         } else {
             //assign roles Students
         }
        
    }

    modifier onlyAdmin() {
        // Modifier for only admin access
        require(msg.sender == admin);
        _;
    }

     modifier onlyChairman() {
        // Modifier for only chairman access
        require(msg.sender == chairman);
        _;
    }

     modifier onlyTrustee() {
        // Modifier for only bods or teacher access
        require(msg.sender == chairman || msg.sender == bods || msg.sender == teacher);
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
        require(voterDetails[msg.sender].hasVoted == false);
        require(start == true);
        require(end == false);
        candidateDetails[candidateId].voteCount += 1;
        voterDetails[msg.sender].hasVoted = true;
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