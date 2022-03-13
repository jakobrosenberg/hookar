import assert from "assert";
import {
  createSequenceHooksCollection,
  createParallelHooksCollection,
  createPipelineCollection,
  createGuardsCollection,
} from "../index.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test("sequence", () => {
  /** @returns {import('../index').HooksCollectionSync<{foo: string}>} */
  const _createSequenceHooksCollection = () => createSequenceHooksCollection();

  test("can handle no hook", () => {
    const emptySequence = _createSequenceHooksCollection();
    const payload = { foo: "bar" };
    const expected = { foo: "bar" };
    const result = emptySequence.run(payload);

    test("payload should be intact", () => {
      assert.deepEqual(payload, expected);
    });
    test("return value should be payload", () => {
      assert.equal(result, payload);
    });
  });

  test("hooks mutate the payload in sequence", async () => {
    const sequence = createSequenceHooksCollection();
    const payload = { string: "" };

    sequence(async (x) => {
      await delay(20);
      x.string += "1";
    });

    sequence(async (x) => {
      await delay(0);
      x.string += "2";
    });

    sequence(async (x) => {
      x.string += "3";
    });

    await sequence.run(payload);
    test("hooks should run in order", () => {
      assert.deepEqual(payload, { string: "123" });
    });
  });

  test("can unregister hook", () => {
    const payload = { number: 0 };
    const sequence = createSequenceHooksCollection();
    const unregister = sequence((x) => x.number++);
    sequence.run(payload);
    sequence.run(payload);
    assert.equal(payload.number, 2);
    unregister();
    sequence.run(payload);
    sequence.run(payload);
    assert.equal(payload.number, 2);
  });
});

test("parallel", () => {
  test("can handle no hook", async () => {
    const parallel = createParallelHooksCollection();
    const payload = { foo: "bar" };
    const expected = { foo: "bar" };
    const result = await parallel.run(payload);

    test("payload should be intact", () => {
      assert.deepEqual(payload, expected);
    });
    test("return value should be payload", () => {
      assert.equal(result, payload);
    });
  });

  test("hooks mutate the payload in parallel", async () => {
    /** @returns {import('../index').HooksCollectionAsync<{string: string}>} */
    const parallel = createParallelHooksCollection();
    const payload = { string: "" };

    parallel(async (x) => {
      await delay(20);
      x.string += "1";
    });

    parallel(async (x) => {
      await delay(0);
      x.string += "2";
    });

    parallel(async (x) => {
      x.string += "3";
    });

    await parallel.run(payload);

    assert.deepEqual(payload, { string: "321" });
  });
});

test("pipeline", () => {
  test("can handle no hook", async () => {
    const pipeline = createPipelineCollection();
    const payload = { foo: "bar" };
    const expected = { foo: "bar" };
    const result = await pipeline.run(payload);

    test("payload should be intact", () => {
      assert.deepEqual(payload, expected);
    });
    test("return value should be payload", () => {
      assert.equal(result, payload);
    });
  });

  test("can handle hooks", async () => {
    /** @returns {import('../index').PipelineCollectionAsync<{string: string}>} */
    const pipeline = createPipelineCollection();
    const payload = "";

    pipeline(async (x) => {
      await delay(20);
      return x + "1";
    });

    pipeline(async (x) => {
      await delay(0);
      return x + "2";
    });

    pipeline(async (x) => {
      return x + "3";
    });

    const result = await pipeline.run(payload);

    assert.deepEqual(result, "123");
  });
});

test("guard", () => {
  test("all true returns true", async () => {
    const guards = createGuardsCollection();
    guards((x) => 1);
    guards((x) => 1);
    guards((x) => 1);
    const result = guards.run();
    assert.equal(result, 1);
  });
  test("values are proxied", async () => {
    const guards = createGuardsCollection();
    guards((x) => x);
    guards((x) => x);
    guards((x) => x);
    const result = guards.run("foobar");
    assert.equal(result, "foobar");
  });
  test("can handle async", async () => {
    const guards = createGuardsCollection();
    guards((x) => x + 1);
    guards(async (x) => x + 2);
    guards((x) => x + 3);
    const result = await guards.run("foobar");
    assert.equal(result, "foobar3");
  });
  test("single false value returns false", async () => {
    const guards = createGuardsCollection();
    guards((x) => x + 1);
    guards(async (x) => false);
    guards((x) => x + 3);
    const result = await guards.run("foobar");
    assert.equal(result, false);
  });
});

test("runOnce", () => {
  let counter = 0;
  const hooks = createSequenceHooksCollection();
  hooks(() => {
    counter = counter + 1;
  });
  hooks.runOnce();
  hooks.runOnce();
  hooks.runOnce();
  assert.equal(counter, 1);
});
