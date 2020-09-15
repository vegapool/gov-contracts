import {propose, stake} from "./utils";
// @ts-ignore
import * as truffleAssert from "truffle-assertions"

contract("BancorGovernance", async (accounts) => {
  const BancorGovernance = artifacts.require("BancorGovernance");
  const TestToken = artifacts.require("TestToken");
  const decimals = 1e18

  let governance: any;
  let voteToken: any;

  const executor = accounts[2]
  const someone = accounts[3]

  before(async () => {
    voteToken = await TestToken.new()

    // get the executor some tokens
    await voteToken.mint(executor, (100 * decimals).toString())
  })

  beforeEach(async () => {
    governance = await BancorGovernance.new(
      voteToken.address
    );
  })

  describe("#revoke()", async () => {
    it("should be able to revoke votes", async () => {
      // stake
      await stake(
        governance,
        voteToken,
        executor,
        2
      )
      // propose
      const proposalId = await propose(
        governance,
        executor
      )
      // vote for
      await governance.voteFor(
        proposalId,
        {from: executor}
      )
      // revoke
      await governance.revoke(
        {from: executor}
      )
    })

    it("should not be able to revoke twice", async () => {
      // stake
      await stake(
        governance,
        voteToken,
        executor,
        2
      )
      // propose
      const proposalId = await propose(
        governance,
        executor
      )
      // vote for
      await governance.voteFor(
        proposalId,
        {from: executor}
      )
      // revoke
      await governance.revoke(
        {from: executor}
      )
      // should not revoke twice
      await truffleAssert.fails(
        // revoke
        governance.revoke(
          {from: executor}
        ),
        truffleAssert.ErrorType.REVERT,
        "ERR_NOT_VOTER"
      );
    })

    it("should not be able to revoke if not voted", async () => {
      await truffleAssert.fails(
        // revoke
        governance.revoke(
          {from: someone}
        ),
        truffleAssert.ErrorType.REVERT,
        "ERR_NOT_VOTER"
      );
    })
  })
})
