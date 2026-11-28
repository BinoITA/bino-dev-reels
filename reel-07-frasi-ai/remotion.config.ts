/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
// PNG invece di JPEG per i fotogrammi intermedi: testi e bordi più netti (render un po' più lento)
Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);
