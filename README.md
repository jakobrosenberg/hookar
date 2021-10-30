# HOOKAR

### Create a hooks and pipeline effortlessly

- Sequence & parallel operation
- Type completion
- Pipeline mode

## usage
```javascript
import { createSequenceHooksCollection } from 'hookar'

const person = { title: 'mr', name: 'John Doe' }

/**
 *  Create a collection
 *  we don't need to supply the person object on creation
 *  but doing so gives us type completion
 */
const collection => createSequenceHooksCollection(person)

/**
 * add a hook
 */
const capitalizeTitle = person => { person.title = title.toUpperCase() }
const unregister = collection(capitalizeTitle)

/**
 * run the hooks on an object
 */
collection.run(person)

console.log(person) // { title: 'MR', name: 'John Doe' }

```

## Hook Runners

Hookar comes with three hook runners:

### createSequenceHooksCollection
This runner lets each hook mutate the provided object in the order the hooks are added.
The return of the hook is ignored.

### createParallelHooksCollection
This runner works like createSequenceHooksCollection, except hook are run in parallel.

### createPipelineCollection
This runner provides each hook with the return value of the previously executed hook.
