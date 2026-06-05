const { withAppBuildGradle } = require('@expo/config-plugins');

const SIGNING_VARS = `    def releaseStoreFilePath = findProperty('PALINDROME_RELEASE_STORE_FILE') ?: System.getenv('PALINDROME_RELEASE_STORE_FILE') ?: '../../release.keystore'
    def releaseStorePassword = findProperty('PALINDROME_RELEASE_STORE_PASSWORD') ?: System.getenv('PALINDROME_RELEASE_STORE_PASSWORD')
    def releaseKeyAlias = findProperty('PALINDROME_RELEASE_KEY_ALIAS') ?: System.getenv('PALINDROME_RELEASE_KEY_ALIAS')
    def releaseKeyPassword = findProperty('PALINDROME_RELEASE_KEY_PASSWORD') ?: System.getenv('PALINDROME_RELEASE_KEY_PASSWORD') ?: releaseStorePassword
    def releaseStoreFile = file(releaseStoreFilePath)
    def hasReleaseSigning = releaseStoreFile.exists() && releaseStorePassword && releaseKeyAlias && releaseKeyPassword

`;

const RELEASE_SIGNING_CONFIG = `        release {
            if (hasReleaseSigning) {
                storeFile releaseStoreFile
                storePassword releaseStorePassword
                keyAlias releaseKeyAlias
                keyPassword releaseKeyPassword
            }
        }
`;

const RELEASE_SIGNING_GUARD = `            if (!hasReleaseSigning) {
                throw new GradleException("Release signing is not configured. Set PALINDROME_RELEASE_STORE_PASSWORD, PALINDROME_RELEASE_KEY_ALIAS, and PALINDROME_RELEASE_KEY_PASSWORD in android/gradle.properties or environment variables. The default store file is ../../release.keystore.")
            }
            signingConfig signingConfigs.release`;

function addReleaseSigning(appBuildGradle) {
  let contents = appBuildGradle;

  if (!contents.includes('PALINDROME_RELEASE_STORE_PASSWORD')) {
    contents = contents.replace(/(\n\s*signingConfigs\s*\{)/, `\n${SIGNING_VARS}$1`);
  }

  if (!contents.includes('signingConfigs.release')) {
    contents = contents.replace(/(\n\s*signingConfigs\s*\{[\s\S]*?\n\s*debug\s*\{[\s\S]*?\n\s*}\n)(\s*})/, `$1${RELEASE_SIGNING_CONFIG}$2`);
    contents = contents.replace(/signingConfig signingConfigs\.debug/, RELEASE_SIGNING_GUARD);
  }

  return contents;
}

module.exports = function withAndroidReleaseSigning(config) {
  return withAppBuildGradle(config, (config) => {
    config.modResults.contents = addReleaseSigning(config.modResults.contents);
    return config;
  });
};
