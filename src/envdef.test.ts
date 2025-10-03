import { describe, expect, test } from 'vitest';
import type { EnvDefItem } from './types';
import envdef from './envdef';
import { faker } from '@faker-js/faker';
import envVarNameFactory from './test-utils/envVarNameFactory';
import parseDefItem from './parseDefItem';

// shortcut
const oneToFive = { min: 1, max: 5 };

/**
 * unit tests
 */
describe('envdef', () => {
  test('happy path', () => {
    // init defs
    const mockDefsListed: EnvDefItem[] = faker.helpers.multiple(
      () => ({
        name: envVarNameFactory(),
      }),
      { count: oneToFive },
    );
    const mockDefsWithDefault: EnvDefItem[] = faker.helpers.multiple(
      () => ({
        name: envVarNameFactory(),
        default: faker.string.sample(),
      }),
      { count: oneToFive },
    );
    const mockDefs: EnvDefItem[] = [...mockDefsListed, ...mockDefsWithDefault];
    // mocking `process.env` containing all necessary values
    const mockProcessEnv = mockDefsListed.reduce<any>((acc, x) => {
      return { ...acc, [x.name]: faker.string.sample() };
    }, {}); // adding listed variables
    new Array(faker.number.int(oneToFive)).fill(true).forEach((_) => {
      mockProcessEnv[`${envVarNameFactory()}_${Date.now()}`] =
        faker.string.sample();
    }); // adding unlisted variables
    // run
    const actual = envdef(mockDefs, mockProcessEnv);
    // assert
    const expected = mockDefs.reduce((acc, x) => {
      return { ...acc, [x.name]: parseDefItem(x, mockProcessEnv) };
    }, {});
    expect(actual).toEqual(expected);
  });

  test('errors', () => {
    // init defs
    const mockDefs: EnvDefItem[] = faker.helpers.multiple(
      () => ({
        name: envVarNameFactory(),
      }),
      { count: oneToFive },
    );
    // simulating empty `process.env`
    const mockProcessEnv = {};
    // run & assert
    const expectedErrorMessages = mockDefs.map((x) => {
      try {
        parseDefItem(x, mockProcessEnv);
        return {
          name: x.name,
          message: 'This should never occur.',
        };
      } catch (err: any) {
        return {
          name: x.name,
          message: err.message,
        };
      }
    }); // composing errors
    expect(() => envdef(mockDefs, mockProcessEnv)).toThrowError(
      expect.objectContaining({ messages: expectedErrorMessages }),
    );
  });
});
