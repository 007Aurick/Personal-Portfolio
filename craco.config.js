/**
 * CRA override — @mediapipe (via drei) ships without .map files; silence source-map-loader noise.
 */
module.exports = {
  webpack: {
    configure: (config) => {
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        /Failed to parse source map/,
      ];

      const patchSourceMapLoader = (rules) => {
        if (!rules) return;
        for (const rule of rules) {
          if (rule.oneOf) patchSourceMapLoader(rule.oneOf);
          const uses = rule.use || (rule.loader ? [{ loader: rule.loader }] : []);
          const isSourceMapLoader = uses.some(
            (u) => u && u.loader && String(u.loader).includes('source-map-loader')
          );
          if (isSourceMapLoader) {
            const prev = rule.exclude;
            rule.exclude = prev
              ? Array.isArray(prev)
                ? [...prev, /@mediapipe/]
                : [prev, /@mediapipe/]
              : /@mediapipe/;
          }
        }
      };

      patchSourceMapLoader(config.module.rules);
      return config;
    },
  },
};
