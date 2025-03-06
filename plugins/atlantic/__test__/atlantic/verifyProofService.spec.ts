import { VerifierParam } from '../../src/types/Atlantic.js';
import { verifyProofService } from '../../src/actions/verifyProofService.js';
import { createMockStarknetAgent } from '../jest/setEnvVars.js';

const agent = createMockStarknetAgent();

describe('verifyProofService', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });
  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  describe('With perfect match inputs', () => {});
  it('Should return an url to atlantic dashboard with query id', async () => {
    process.env.ATLANTIC_API_KEY = '';
    process.env.PATH_UPLOAD_DIR =
      './test/unit-test/method/infra/atlantic/uploads/';
    const getProofParam: VerifierParam = {
      filename: 'recursive_proof.json',
      memoryVerification: 'relaxed',
    };

    const result = await verifyProofService(agent, getProofParam);
    const parsed = JSON.parse(result);

    expect(parsed).toEqual({
      status: 'success',
      url: expect.any(String),
    });
  });
  describe('With no filename input', () => {});
  it('Invalid Type', async () => {
    process.env.ATLANTIC_API_KEY = '';
    process.env.PATH_UPLOAD_DIR =
      './test/unit-test/method/infra/atlantic/uploads/';
    const getProofParam: VerifierParam = {
      filename: 'Pie.zip',
      memoryVerification: 'relaxed',
    };

    const result = await verifyProofService(agent, getProofParam);
    const parsed = JSON.parse(result);

    expect(parsed).toEqual({
      status: 'failure',
      error: expect.any(String),
    });
  });
  it('Invalid filename', async () => {
    process.env.ATLANTIC_API_KEY = '';
    process.env.PATH_UPLOAD_DIR =
      './test/unit-test/method/infra/atlantic/uploads/';
    const getProofParam: VerifierParam = {
      filename: 'sfddfds',
      memoryVerification: 'relaxed',
    };

    const result = await verifyProofService(agent, getProofParam);
    const parsed = JSON.parse(result);

    expect(parsed).toEqual({
      status: 'failure',
      error: expect.any(String),
    });
  });
  it('Invalid API key', async () => {
    process.env.ATLANTIC_API_KEY = 'invalid';
    process.env.PATH_UPLOAD_DIR =
      './test/unit-test/method/infra/atlantic/uploads/';
    const getProofParam: VerifierParam = {
      filename: 'recursive_proof.json',
      memoryVerification: 'relaxed',
    };

    const result = await verifyProofService(agent, getProofParam);
    const parsed = JSON.parse(result);

    expect(parsed).toEqual({
      status: 'failure',
      error: expect.any(String),
    });
  });
  it('invalid upload path', async () => {
    process.env.ATLANTIC_API_KEY = '';
    process.env.PATH_UPLOAD_DIR = './invalid/path';
    const getProofParam: VerifierParam = {
      filename: 'recursive_proof.json',
      memoryVerification: 'relaxed',
    };

    const result = await verifyProofService(agent, getProofParam);
    const parsed = JSON.parse(result);

    expect(parsed).toEqual({
      status: 'failure',
      error: expect.any(String),
    });
  });
  it('Invalide memory verification', async () => {
    process.env.ATLANTIC_API_KEY = '';
    process.env.PATH_UPLOAD_DIR =
      './test/unit-test/method/infra/atlantic/uploads/';
    const getProofParam: VerifierParam = {
      filename: 'recursive_proof.json',
      memoryVerification: 'invalid',
    };

    const result = await verifyProofService(agent, getProofParam);
    const parsed = JSON.parse(result);

    expect(parsed).toEqual({
      status: 'failure',
      error: expect.any(String),
    });
  });
});
