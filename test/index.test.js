import assert from 'assert'
import {
    createSequenceHooksCollection,
    createParallelHooksCollection,
    createPipelineCollection,
} from '../index.js'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

test('sequence', test => {
    /** @returns {import('../index').HooksCollectionSync<{foo: string}>} */
    const _createSequenceHooksCollection = () => createSequenceHooksCollection()

    test('can handle no hook', (test) => {
        const emptySequence = _createSequenceHooksCollection()
        const payload = { foo: 'bar' }
        const expect = { foo: 'bar' }
        const result = emptySequence.run(payload)

        test('payload should be intact', () => assert.deepEqual(payload, expect))
        test('return value should be payload', () => assert.equal(result, payload))
    })

    test('hooks mutate the payload in sequence', async test => {
        const sequence = createSequenceHooksCollection()
        const payload = { string: '' }

        sequence(async x => {
            await delay(20)
            x.string += '1'
        })

        sequence(async x => {
            await delay(0)
            x.string += '2'
        })

        sequence(async x => {
            x.string += '3'
        })

        await sequence.run(payload)
        test('hooks should run in order', () => {
            assert.deepEqual(payload, { string: '123' })
        })
    })

    test('can unregister hook', test => {
        const payload = { number: 0 }
        const sequence = createSequenceHooksCollection()
        const unregister = sequence(x => x.number++)
        sequence.run(payload)
        sequence.run(payload)
        assert.equal(payload.number, 2)
        unregister()
        sequence.run(payload)
        sequence.run(payload)
        assert.equal(payload.number, 2)
    })
})

test('parallel', test => {
    test('can handle no hook', async (test) => {
        const parallel = createParallelHooksCollection()
        const payload = { foo: 'bar' }
        const expect = { foo: 'bar' }
        const result = await parallel.run(payload)

        test('payload should be intact', () => assert.deepEqual(payload, expect))
        test('return value should be payload', () => assert.equal(result, payload))
    })

    test('hooks mutate the payload in parallel', async test => {
        /** @returns {import('../index').HooksCollectionAsync<{string: string}>} */
        const parallel = createParallelHooksCollection()
        const payload = { string: '' }

        parallel(async x => {
            await delay(20)
            x.string += '1'
        })

        parallel(async x => {
            await delay(0)
            x.string += '2'
        })

        parallel(async x => {
            x.string += '3'
        })

        await parallel.run(payload)

        assert.deepEqual(payload, { string: '321' })
    })
})


test('pipeline', test => {
    test('can handle no hook', async (test) => {
        const pipeline = createPipelineCollection()
        const payload = {foo: 'bar'}
        const expect = {foo: 'bar'}
        const result = await pipeline.run(payload)

        test('payload should be intact', () => assert.deepEqual(payload, expect))
        test('return value should be payload', () => assert.equal(result, payload))
    })

    test('can handle hooks', async test => {
        /** @returns {import('../index').PipelineCollectionAsync<{string: string}>} */
        const pipeline = createPipelineCollection()
        const payload = ''

        pipeline(async x => {
            await delay(20)
            return x + '1'
        })

        pipeline(async x => {
            await delay(0)
            return x + '2'
        })

        pipeline(async x => {
            return x + '3'
        })

        const result = await pipeline.run(payload)

        assert.deepEqual(result, '123')
    })
})


