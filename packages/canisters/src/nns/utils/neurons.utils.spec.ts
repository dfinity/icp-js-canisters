import { uint8ArrayToHexString } from "@dfinity/utils";
import { Principal } from "@icp-sdk/core/principal";
import { Vote } from "../enums/governance.enums";
import type { NeuronInfo, ProposalInfo } from "../types/governance_converters";
import {
  ineligibleNeurons,
  memoToNeuronAccountIdentifier,
  memoToNeuronSubaccount,
  votableNeurons,
  votedNeurons,
} from "./neurons.utils";

describe("neurons-utils", () => {
  const proposalTimestampSeconds = BigInt(new Date().getTime());

  const proposalId = BigInt(3);
  const proposalNeuronId = BigInt(1);

  const proposal: ProposalInfo = {
    id: proposalId,
    proposalTimestampSeconds,
    ballots: [
      {
        neuronId: proposalNeuronId,
        vote: Vote.Yes,
        votingPower: BigInt(1),
      },
    ],
  } as unknown as ProposalInfo;

  const ineligibleNeuronsDate: NeuronInfo[] = [
    {
      createdTimestampSeconds: proposalTimestampSeconds + BigInt(1),
      neuronId: proposalNeuronId,
      recentBallots: [],
    } as unknown as NeuronInfo,
  ];

  const ineligibleNeuronsTooShort: NeuronInfo[] = [
    {
      createdTimestampSeconds: proposalTimestampSeconds - BigInt(1),
      neuronId: BigInt(2),
      recentBallots: [],
    } as unknown as NeuronInfo,
  ];

  const eligibleNeuronsData: NeuronInfo[] = [
    {
      createdTimestampSeconds: proposalTimestampSeconds - BigInt(1),
      neuronId: proposalNeuronId,
      recentBallots: [],
      votingPower: BigInt(1),
    } as unknown as NeuronInfo,
    {
      createdTimestampSeconds: proposalTimestampSeconds - BigInt(2),
      neuronId: proposalNeuronId + 1n,
      recentBallots: [],
      votingPower: BigInt(1),
    } as unknown as NeuronInfo,
    {
      createdTimestampSeconds: proposalTimestampSeconds - BigInt(3),
      neuronId: proposalNeuronId + 2n,
      recentBallots: [],
      votingPower: BigInt(1),
    } as unknown as NeuronInfo,
  ];

  describe("ineligibleNeurons", () => {
    it("should has an ineligible neuron because created after proposal", () => {
      const ineligible = ineligibleNeurons({
        proposal,
        neurons: ineligibleNeuronsDate,
      });

      expect(ineligible).toHaveLength(1);
    });

    it("should has an ineligible neuron because dissolve too short", () => {
      const ineligible = ineligibleNeurons({
        proposal,
        neurons: ineligibleNeuronsTooShort,
      });

      expect(ineligible).toHaveLength(1);
    });

    it("should has not ineligible neuron because empty", () => {
      const ineligible = ineligibleNeurons({ proposal, neurons: [] });

      expect(ineligible).toHaveLength(0);
    });
  });

  describe("votableNeurons", () => {
    it("should not have votable neurons because ineligible", () => {
      let votable = votableNeurons({
        proposal,
        neurons: ineligibleNeuronsDate,
      });

      expect(votable).toHaveLength(0);

      votable = votableNeurons({
        proposal,
        neurons: ineligibleNeuronsTooShort,
      });

      expect(votable).toHaveLength(0);
    });

    it("should not have votable neurons because already voted", () => {
      const votable = votableNeurons({
        proposal,
        neurons: [
          {
            ...eligibleNeuronsData[0],
            recentBallots: [
              {
                proposalId,
                vote: Vote.No,
              },
            ],
          },
        ],
      });

      expect(votable).toHaveLength(0);
    });

    it("should have votable neurons because not yet voted", () => {
      const votable = votableNeurons({
        proposal: {
          ...proposal,
          ballots: [
            {
              neuronId: eligibleNeuronsData[0].neuronId,
              vote: Vote.Unspecified,
              votingPower: BigInt(1),
            },
            {
              neuronId: eligibleNeuronsData[1].neuronId,
              vote: Vote.Yes,
              votingPower: BigInt(1),
            },
            {
              neuronId: eligibleNeuronsData[2].neuronId,
              vote: Vote.No,
              votingPower: BigInt(1),
            },
          ],
        },
        neurons: eligibleNeuronsData,
      });

      expect(votable).toHaveLength(1);
      expect(votable).toEqual([eligibleNeuronsData[0]]);
    });

    it("should have votable neurons regardless of voting power", () => {
      const votable = votableNeurons({
        proposal: {
          ...proposal,
          ballots: [
            {
              neuronId: eligibleNeuronsData[0].neuronId,
              vote: Vote.Unspecified,
              votingPower: BigInt(0),
            },
            {
              neuronId: eligibleNeuronsData[1].neuronId,
              vote: Vote.Yes,
              votingPower: BigInt(1),
            },
            {
              neuronId: eligibleNeuronsData[2].neuronId,
              vote: Vote.Unspecified,
              votingPower: BigInt(2),
            },
          ],
        },
        neurons: eligibleNeuronsData,
      });

      expect(votable).toHaveLength(2);
      expect(votable).toEqual([eligibleNeuronsData[0], eligibleNeuronsData[2]]);
    });
  });

  describe("votedNeurons", () => {
    it("should have only voted neurons", () => {
      const voted = votedNeurons({
        proposal: {
          ...proposal,
          ballots: [
            {
              neuronId: eligibleNeuronsData[0].neuronId,
              vote: Vote.Unspecified,
              votingPower: BigInt(1),
            },
            {
              neuronId: eligibleNeuronsData[1].neuronId,
              vote: Vote.Yes,
              votingPower: BigInt(1),
            },
            {
              neuronId: eligibleNeuronsData[2].neuronId,
              vote: Vote.No,
              votingPower: BigInt(1),
            },
          ],
        },
        neurons: eligibleNeuronsData,
      });

      expect(voted).toEqual([eligibleNeuronsData[1], eligibleNeuronsData[2]]);
    });
  });

  describe("memoToNeuronSubaccount", () => {
    it("should calculate the neuron subaccount", () => {
      // It's not that useful to do the same hashing here so we just use some
      // hardcoded values for a "change detector" test.
      const controller = Principal.fromText("6czrj-7isge-rrema");
      const memo = 123123123n;

      expect(
        uint8ArrayToHexString(
          memoToNeuronSubaccount({ controller, memo }).toUint8Array(),
        ),
      ).toEqual(
        "21c6b6f1c9be307a956fd950687037203c6ceb3557ae5cc49b52010d4497b2d3",
      );
    });
  });

  describe("memoToNeuronAccountIdentifier", () => {
    it("should calculate the neuron account identifier", () => {
      // It's not that useful to do the same hashing here so we just use some
      // hardcoded values for a "change detector" test.
      const governanceCanisterId = Principal.fromText(
        "rrkah-fqaaa-aaaaa-aaaaq-cai",
      );
      const controller = Principal.fromText("jl4mq-2sfmr-lekya");
      const memo = 456456456n;

      expect(
        memoToNeuronAccountIdentifier({
          controller,
          memo,
          governanceCanisterId,
        }).toHex(),
      ).toEqual(
        "2a8523d6488286c937f25a855cc74e640da7115824eb6c78d89d503a37e6b3d8",
      );
    });
  });
});
