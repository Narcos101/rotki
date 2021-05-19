import fs from 'fs';
import { BackendOptions } from '@/electron-main/ipc';
import { Writeable } from '@/types';
import { levels } from '@/utils/log-level';

const CONFIG_FILE = 'rotki_config.json';

const LOGLEVEL = 'loglevel';
const LOGDIR = 'log-dir';
const SLEEP_SECS = 'sleep-secs';
const DATA_DIR = 'data-dir';
const LOG_FROM_OTHER_MODULES = 'logfromothermodules';

export function loadConfig(): Partial<BackendOptions> {
  const options: Writeable<Partial<BackendOptions>> = {};
  const filePath = CONFIG_FILE;
  const configExists = fs.existsSync(filePath);
  if (!configExists) {
    return options;
  }
  try {
    const configFile = fs.readFileSync(filePath);
    const config = JSON.parse(configFile.toString());

    if (LOGLEVEL in config) {
      const configLogLevel = config[LOGLEVEL].toLocaleLowerCase();
      if (levels.includes(configLogLevel)) {
        options.loglevel = configLogLevel;
      }
    }

    if (LOG_FROM_OTHER_MODULES in config) {
      options.logFromOtherModules = config[LOG_FROM_OTHER_MODULES] === true;
    }

    if (LOGDIR in config) {
      options.logDirectory = config[LOGDIR];
    }

    if (DATA_DIR in config) {
      options.dataDirectory = config[DATA_DIR];
    }

    if (SLEEP_SECS in config) {
      options.sleepSeconds = parseInt(config[SLEEP_SECS]);
    }

    return options;
  } catch (e) {
    return options;
  }
}
