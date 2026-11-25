const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.hirammahandi.macrozonetutorial.dev';
  }

  if (IS_PREVIEW) {
    return 'com.hirammahandi.macrozonetutorial.preview';
  }

  return 'com.hirammahandi.macrozonetutorial';
};

const getAppName = (baseName) => {
  if (IS_DEV) {
    return `${baseName} (Dev)`;
  }

  if (IS_PREVIEW) {
    return `${baseName} (Preview)`;
  }

  return baseName;
};

export default ({ config }) => ({
  ...config,
  name: getAppName(config.name),
  ios: {
    ...config.ios,
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    ...config.android,
    package: getUniqueIdentifier(),
  },
});
