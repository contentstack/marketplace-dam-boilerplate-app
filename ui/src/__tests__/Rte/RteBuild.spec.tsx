import fs from "fs";
import path from "path";

const webpackConfig = fs.readFileSync(
  path.join(__dirname, "../../../rte/webpack.common.js"),
  "utf8"
);

describe("RTE plugin build (ui/rte)", () => {
  // BUG: MKT-20265 — webpack.common.js defines "process.env" as JSON.stringify(dotenv.parsed),
  // which inlines every value of ui/rte/.env into the public bundle. Only the names the plugin
  // reads should be defined, one by one.
  test.skip("does not inline the whole .env into the bundle", () => {
    expect(webpackConfig).not.toMatch(
      /"process\.env":\s*JSON\.stringify\(dotenv\.parsed\)/
    );
  });
});
