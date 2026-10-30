export default {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-idiomatic-order',
  ],
  rules: {
    'property-no-vendor-prefix': [
      true,
      {
        ignoreProperties: ['-webkit-tap-highlight-color'],
      },
    ],
  },
}
