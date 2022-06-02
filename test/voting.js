const hre = require("hardhat");
const { ethers } = hre;
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);


describe("Voting 🤖", (accounts) => {
    let voting;
    let owner, admin, chairman, student, teacher, addr1, addr2, addr3, addrs;

    beforeEach(async function () {
        // create the smart contract object to test from
        [owner,admin, chairman, teacher, student, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
        const Voting = await ethers.getContractFactory("Voting");
        voting = await Voting.deploy();
        admin = await voting.owner();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await voting.owner()).to.equal(owner.address);
        });

    });

    describe("Admin", function () {
    //   beforeEach(async function () {
    //       // create the smart contract object to test from
    //       admin = await voting.owner();
    // });

      it("Should set chairman", async function () {
          Chairman =  voting.connect(admin).setChairman(chairman.address);
          // Expect the function to go through
          const txResult = await Chairman.wait();
          expect(txResult.status).to.equal(1);
      });


    })

    describe("Chairman", function () {
    beforeEach(async function () {
        // create the smart contract object to test from
        chairman =  voting.connect(admin).setChairman(chairman.address);
    });

    it("Should be able to add teachers", async function () {
        const addressList = [teacher.address];
        contractFunction = await voting.connect(chairman).setTeacher(addressList);
        // Expect the function to go through
        const txResult = await contractFunction.wait();
        expect(txResult.status).to.equal(1);
    });

    it("should be able to add students", async function () {
        const addressList = [student.address];
        contractFunction = await voting.connect(chairman).setStudent(addressList);
        // Expect the function to go through
        const txResult = await contractFunction.wait();
        expect(txResult.status).to.equal(1);
    });

    it("Should set voting status", async function () {
        

        votingStatus = await voting.connect(chairman).startElection();
        // Expect the function to go through
        const txResult = await votingStatus.wait();
        expect(txResult.status).to.equal(1);
    });

    it("voting status should change", async function () {
        votingStatus = await voting.connect(chairman).endElection();
        // Expect the function to go through
        const status = await voting.connect(chairman).votingState;
        expect(status).to.equal(false);
    });

    it("should be able to create election", async function () {

        votingStatus = await voting.connect(chairman).addCandidate( addr3, "Buhari");
        // Expect the function to go through
        const txResult = await votingStatus.wait();
        expect(txResult.status).to.equal(1);
    });

    it("should be able to get candidate data", async function () {
        // create ballot
        await voting.connect(chairman).addCandidate( addr3, "Buhari");
        
        
        // Expect the function to go through
        votingStatus = await voting.connect(chairman).candidateDetails(0);
        expect(votingStatus.id).to.equal(0);
    });

    it("should be able to vote", async function () {
        // create ballot
        await voting.connect(chairman).addCandidate( addr1, "Goodluck");
        votingStatus = await voting.connect(chairman).startElection();
        
        // Expect the function to go through
        votingStatus = await voting.connect(chairman).vote(0);
        const txResult = await votingStatus.wait();
        expect(txResult.status).to.equal(1);
    });


    })


});

// //
// // this script executes when you run 'yarn test'

