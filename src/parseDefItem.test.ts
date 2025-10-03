import { describe, expect, test, vi } from 'vitest';
import type { EnvDefItem } from './types';
import { faker } from '@faker-js/faker';
import parseDefItem from './parseDefItem';
import envVarNameFactory from './test-utils/envVarNameFactory';

describe('parseDefItem', () => {
  describe('base', () => {
    test('happy path', () => {
      const mockEnvVarName = envVarNameFactory();
      const mockDefItem: EnvDefItem = {
        name: mockEnvVarName,
      };
      const mockProcessEnv = {
        [mockEnvVarName]: faker.string.sample(),
      };
      const actual = parseDefItem(mockDefItem, mockProcessEnv);
      expect(actual).toBe(mockProcessEnv[mockEnvVarName]);
    });

    test('missing required variable', () => {
      // init
      const mockEnvVarName = envVarNameFactory();
      const mockDefItem: EnvDefItem = {
        name: mockEnvVarName,
      };
      const mockProcessEnv = {}; // target variable absent
      // run & assert
      expect(() => parseDefItem(mockDefItem, mockProcessEnv)).toThrowError(
        `${mockEnvVarName} environment variable is required.`,
      );
    });
  });

  describe('default', () => {
    test('env var value is absent', () => {
      // init
      const mockEnvVarName = envVarNameFactory();
      const mockDefaultValue = faker.string.sample();
      const mockDefItem: EnvDefItem = {
        name: mockEnvVarName,
        default: mockDefaultValue,
      };
      const mockProcessEnv = {}; // target variable absent
      // run & assert
      const actual = parseDefItem(mockDefItem, mockProcessEnv);
      expect(actual).toBe(mockDefaultValue);
    });
  });

  describe('nonProdDefault', () => {
    test('NODE_ENV is non-prod', () => {
      // init
      const mockEnvVarName = envVarNameFactory();
      const mockNonProdDefaultValue = faker.string.sample();
      const mockDefItem: EnvDefItem = {
        name: mockEnvVarName,
        nonProdDefault: mockNonProdDefaultValue,
      };
      const mockProcessEnv = { NODE_ENV: faker.lorem.word() }; // NODE_ENV only
      // run & assert
      const actual = parseDefItem(mockDefItem, mockProcessEnv);
      expect(actual).toBe(mockNonProdDefaultValue);
    });

    test('NODE_ENV is "production"', () => {
      // init
      const mockEnvVarName = envVarNameFactory();
      const mockNonProdDefaultValue = faker.string.sample();
      const mockDefaultValue = faker.string.sample();
      const mockDefItem: EnvDefItem = {
        name: mockEnvVarName,
        nonProdDefault: mockNonProdDefaultValue,
        default: mockDefaultValue,
      };
      const mockProcessEnv = { NODE_ENV: 'production' }; // NODE_ENV only
      // run & assert
      const actual = parseDefItem(mockDefItem, mockProcessEnv);
      expect(actual).toBe(mockDefaultValue);
    });

    test('NODE_ENV is empty', () => {
      // init
      const mockEnvVarName = envVarNameFactory();
      const mockNonProdDefaultValue = faker.string.sample();
      const mockDefaultValue = faker.string.sample();
      const mockDefItem: EnvDefItem = {
        name: mockEnvVarName,
        nonProdDefault: mockNonProdDefaultValue,
        default: mockDefaultValue,
      };
      const mockProcessEnv = {}; // empty `process.env`
      // run & assert
      const actual = parseDefItem(mockDefItem, mockProcessEnv);
      expect(actual).toBe(mockDefaultValue);
    });
  });

  describe('validate', () => {
    test('validate() has `value` as argument', () => {
      // init
      const mockEnvVarName = envVarNameFactory();
      const mockValue = faker.string.sample();
      const spy = vi.fn();
      const mockDefItem: EnvDefItem = {
        name: mockEnvVarName,
        validate: (arg) => {
          spy(arg);
          return true;
        },
      };
      const mockProcessEnv = { [mockEnvVarName]: mockValue };
      // run
      parseDefItem(mockDefItem, mockProcessEnv);
      // assert
      expect(spy).toHaveBeenCalledWith(mockValue); // TODO: compare to `inner()` ?
    });

    test('validate() returns false', () => {
      // init
      const mockEnvVarName = envVarNameFactory();
      const mockValue = faker.string.sample();
      const mockDefItem: EnvDefItem = {
        name: mockEnvVarName,
        validate: () => false,
      };
      const mockProcessEnv = { [mockEnvVarName]: mockValue };
      // run & assert
      expect(() => parseDefItem(mockDefItem, mockProcessEnv)).toThrowError(
        `${mockEnvVarName} environment variable custom validation failed.`,
      );
    });
  });

  describe('optional', () => {
    test('no default set', () => {
      // init
      const mockEnvVarName = envVarNameFactory();
      const mockDefItem: EnvDefItem = {
        name: mockEnvVarName,
        optional: true,
      };
      const mockProcessEnv = {}; // target variable absent
      // run & assert
      expect(parseDefItem(mockDefItem, mockProcessEnv)).toBeUndefined();
    });

    test('default is set', () => {
      // init
      const mockEnvVarName = envVarNameFactory();
      const mockDefaultValue = faker.string.sample();
      const mockDefItem: EnvDefItem = {
        name: mockEnvVarName,
        default: mockDefaultValue,
        optional: true,
      };
      const mockProcessEnv = {}; // target variable absent
      // run & assert
      expect(parseDefItem(mockDefItem, mockProcessEnv)).toBe(mockDefaultValue);
    });
  });
});
