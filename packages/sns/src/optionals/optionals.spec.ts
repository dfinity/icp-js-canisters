import type { NeuronsFundParticipationConstraints as SnsNeuronsFundParticipationConstraints } from "../../candid/sns_swap";
import { emptyOptionalsForSnsNeuronsFundParticipationConstraints } from "./optionals";

// If this file has a compilation error because new optional fields were added
// to a Candid type, add the empty optional field values to the corresponding
// `emptyOptionalsFor...` value in `./optionals.ts`.

const testValueForSnsNeuronsFundParticipationConstraints: SnsNeuronsFundParticipationConstraints =
  {
    ...emptyOptionalsForSnsNeuronsFundParticipationConstraints,
    coefficient_intervals: [],
  };

// The real test is whether the types above are accepted by the compiler.
it("should have at least one test", () => {
  expect(true).toBe(true);
});
