import { getGenerator } from "grit-cli";
import path from "path";

const generator = path.join(__dirname, "..");

const runGenerator = async (answers: Record<string, any>) => {
  return await (
    await getGenerator({
      generator,
      mock: true,
      answers: answers,
    })
  ).run();
};

describe("Name of the group", () => {
  it("package.json updates values", async () => {
    const grit = await runGenerator({
      name: "test",
      version: "0.0.1",
      description: "test",
      username: "test",
      email: "test",
      website: "test",
      license: false,
    });

    expect(grit.pkg.name).toBe("test");
    expect(grit.pkg.version).toBe("0.0.1");
    expect(grit.pkg.description).toBe("test");
    expect(grit.pkg.author).toBe("test <test> (test)");
    expect(grit.pkg.repository.url).toBe("test/test");
  });

  it("should allow unique space separated keywords", async () => {
    const grit = await runGenerator({
      keywords: "test test2 test3",
    });

    expect(grit.pkg.keywords).toEqual(["test", "test2", "test3"]);
  });

  it("output license file", async () => {
    const grit = await runGenerator({
      name: "test",
      version: "0.0.1",
      description: "test",
      username: "test",
      email: "test",
      website: "test",
      license: true,
    });

    expect(await grit.getOutputFiles()).toContain("LICENSE");

    expect(grit.pkg.license).toBe("MIT");
  });

  it("output readme file", async () => {
    const grit = await runGenerator({
      name: "test",
      version: "0.0.1",
      description: "test",
      username: "test",
      email: "test",
      website: "test",
      readme: true,
    });

    expect(await grit.getOutputFiles()).toContain("README.md");
  });
});
