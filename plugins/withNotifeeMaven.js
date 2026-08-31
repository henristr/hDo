const { withProjectBuildGradle } = require("@expo/config-plugins");

module.exports = function withNotifeeMaven(config) {
  return withProjectBuildGradle(config, (config) => {
    const contents = config.modResults.contents;

    if (!contents.includes("@notifee/react-native/android/libs")) {
      config.modResults.contents = contents.replace(
        /allprojects\s*\{\s*repositories\s*\{/,
        `allprojects {
  repositories {
    maven {
      url "$rootDir/../node_modules/@notifee/react-native/android/libs"
    }`,
      );
    }

    return config;
  });
};
