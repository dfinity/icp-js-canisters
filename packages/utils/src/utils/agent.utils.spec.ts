import { HttpAgent } from "@icp-sdk/core/agent";
import {
  mockAgentManagerConfig,
  mockHttpAgent,
  mockHttpAgent2,
} from "../mocks/agent.mock";
import { mockIdentity, mockIdentity2 } from "../mocks/identity.mock";
import { AgentManager } from "./agent.utils";

vi.mock("@icp-sdk/core/agent", () => ({
  HttpAgent: {
    create: vi.fn(),
  },
}));

describe("AgentManager", () => {
  let agentManager: AgentManager;
  const mockHttpAgentCreate = vi.mocked(HttpAgent.create);

  beforeEach(() => {
    agentManager = AgentManager.create(mockAgentManagerConfig);
    vi.clearAllMocks();

    mockHttpAgentCreate.mockResolvedValueOnce(mockHttpAgent);
  });

  describe("getAgent", () => {
    it("should create a new agent when there is none", async () => {
      const { getAgent } = agentManager;

      const agent = await getAgent({ identity: mockIdentity });

      expect(mockHttpAgentCreate).toHaveBeenCalledWith(
        expect.objectContaining({ identity: mockIdentity }),
      );
      expect(agent).toBe(mockHttpAgent);
    });

    it("should return cached agent if already created", async () => {
      const { getAgent } = agentManager;

      await getAgent({ identity: mockIdentity });

      const agent = await getAgent({ identity: mockIdentity });

      expect(mockHttpAgentCreate).toHaveBeenCalledOnce();
      expect(agent).toBe(mockHttpAgent);
    });

    it("should handle multiple agents for multiple identities", async () => {
      const { getAgent } = agentManager;

      await getAgent({ identity: mockIdentity });

      mockHttpAgentCreate.mockResolvedValueOnce(mockHttpAgent2);

      const agent2 = await getAgent({ identity: mockIdentity2 });
      const agent1 = await getAgent({ identity: mockIdentity });

      expect(mockHttpAgentCreate).toHaveBeenCalledTimes(2);

      expect(agent1).toBe(mockHttpAgent);
      expect(agent1).not.toBe(mockHttpAgent2);

      expect(agent2).toBe(mockHttpAgent2);
      expect(agent2).not.toBe(mockHttpAgent);
    });
  });

  describe("clearAgents", () => {
    it("should clear cached agents", async () => {
      const { getAgent, clearAgents } = agentManager;

      await getAgent({ identity: mockIdentity });

      const agentBefore = await getAgent({
        identity: mockIdentity,
      });

      expect(agentBefore).toBe(mockHttpAgent);

      clearAgents();

      const agentAfter = await getAgent({
        identity: mockIdentity,
      });

      expect(mockHttpAgentCreate).toHaveBeenCalledTimes(2);
      expect(agentAfter).not.toBe(mockHttpAgent);
      expect(agentAfter).toBeUndefined();
    });
  });
});
