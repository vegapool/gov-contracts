import {stake} from "./utils";
// @ts-ignore
import * as truffleAssert from "truffle-assertions"

contract("BancorGovernance", async (accounts) => {
  const BancorGovernance = artifacts.require("BancorGovernance");
  const TestToken = artifacts.require("TestToken");

  const decimals = 1e18

  let governance: any;
  let voteToken: any;

  const executor = accounts[2]

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

  describe("#stake()", async () => {
    it("should be able to stake 2", async () => {
      await stake(
        governance,
        voteToken,
        executor,
        2
      )
    })

    it("should not be able to stake 0", async () => {
      await truffleAssert.fails(
        // stake
        governance.stake(
          (0).toString(),
          {from: executor}
        ),
        truffleAssert.ErrorType.REVERT,
        "ERR_STAKE_ZERO"
      )
    })
  })
})
