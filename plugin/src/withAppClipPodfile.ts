import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import { ConfigPlugin, withDangerousMod } from "expo/config-plugins";
import * as fs from "fs";
import * as path from "path";

export const withAppClipPodfile: ConfigPlugin<{ appClipFolder: string }> = (
  config,
  { appClipFolder }
) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const podFilePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );
      const podFileContent = fs.readFileSync(podFilePath).toString();

      const modifiedPodfile = mergeContents({
        tag: "withAppClipPodfile",
        src: podFileContent,
        newSrc: `  target '${appClipFolder}' do\n  end`,
        anchor: /post_install/,
        offset: 0,
        comment: "#",
      });

      await fs.promises.writeFile(podFilePath, modifiedPodfile.contents);

      return config;
    },
  ]);
};