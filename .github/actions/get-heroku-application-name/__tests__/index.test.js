const { getHerokuApplicationName } = require("../index");
const fs = require("fs");

jest.mock("fs");
fs.existsSync.mockReturnValue(true);

describe("get-heroku-application-name", () => {

  test("when the metadata file is empty", () => {
    fs.readFileSync.mockReturnValue('');

    const actual = getHerokuApplicationName("dev");

    expect(actual).toBe("invh-property-listing-dev");
  });

  test("when the deployment section is not defined", () => {
    fs.readFileSync.mockReturnValue(`
team: property-listing
`);

    const actual = getHerokuApplicationName("dev");

    expect(actual).toBe("invh-property-listing-dev");
  });

  test("when the environment is not defined", () => {
    fs.readFileSync.mockReturnValue(`
deployment:
  heroku-application-name: 
    prod: "property-listing-prod"
`);

    const actual = getHerokuApplicationName("dev");

    expect(actual).toBe("invh-property-listing-dev");
  });

  test("when the heroku application name is overriden", () => {
    fs.readFileSync.mockReturnValue(`
deployment:
  heroku-application-name: 
    dev: "property-listing-dev"
`);

    const actual = getHerokuApplicationName("dev");

    expect(actual).toBe("property-listing-dev");
  });
});