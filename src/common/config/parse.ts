import {
  parse as parseIni,
  $Errors,
} from 'js-ini';
import { get, omit } from 'lodash';
import { StoredConfig } from '../../types';

function parse(config: string) {
  return parseIni(config, {
    comment: '#',
    nothrow: true,
    autoTyping: false,
  }) as StoredConfig;
}

export function parseConfig(config: string): StoredConfig {
  return omit(parse(config), $Errors) as StoredConfig;
}

export function parseConfigError(config: string) {
  return get(parse(config), $Errors);
}
