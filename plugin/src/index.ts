import { IOSConfig, type ConfigPlugin } from "expo/config-plugins";

import { withConfig } from "./withConfig";
import { withEntitlements } from "./withEntitlements";
import { withPlist } from "./withPlist";
import { withPodfile } from "./withPodfile";
import { withXcode } from "./withXcode";
import { withDeviceFamily } from "@expo/config-plugins/build/ios/DeviceFamily";

const withAppClip: ConfigPlugin<{
  name?: string;
  bundleIdSuffix?: string;
  targetSuffix?: string;
  groupIdentifier?: string;
  deploymentTarget?: string;
  requestEphemeralUserNotification?: boolean;
  requestLocationConfirmation?: boolean;
  appleSignin?: boolean;
  applePayMerchantIds?: string[];
  excludedPackages?: string[];
}> = (
  config,
  {
    name,
    bundleIdSuffix,
    targetSuffix,
    groupIdentifier,
    deploymentTarget,
    requestEphemeralUserNotification,
    requestLocationConfirmation,
    appleSignin,
    applePayMerchantIds,
    excludedPackages,
  } = {},
) => {
  name ??= "Clip";
  bundleIdSuffix ??= "Clip";
  targetSuffix ??= "Clip";
  deploymentTarget ??= "14.0";
  appleSignin ??= false;
  requestEphemeralUserNotification ??= false;
  requestLocationConfirmation ??= false;

  if (!config.ios?.bundleIdentifier) {
    throw new Error("No bundle identifier specified in app config");
  }

  const bundleIdentifier = `${config.ios.bundleIdentifier}.${bundleIdSuffix}`;
  const targetName = `${IOSConfig.XcodeUtils.sanitizedName(config.name)}${targetSuffix}`;

  const modifiedConfig = withConfig(
    withEntitlements(
      withPodfile(
        withPlist(
          withXcode(
            withDeviceFamily(config),
            {
              name,
              targetName,
              bundleIdentifier,
              deploymentTarget,
            }
          ),
          {
            targetName,
            deploymentTarget,
            requestEphemeralUserNotification,
            requestLocationConfirmation,
          }
        ),
        { targetName, excludedPackages }
      ),
      { targetName, groupIdentifier: groupIdentifier ?? '', appleSignin, applePayMerchantIds: applePayMerchantIds ?? [] }
    ),
    { targetName, bundleIdentifier, appleSignin, applePayMerchantIds: applePayMerchantIds ?? [] }
  );

  return modifiedConfig;
};

export default withAppClip;