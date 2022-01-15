# JSON Standards
* Devs are familiar with design-patterns but
* not enough with j-standards!

## Motivation
* Not re-inventing the wheel
* Common language with other devs
* Solved problems we haven't even thought about yet
* Existing infrastructure and packages
* Easier integration with other systems

## Standards
### [JSON Pointer](https://gregsdennis.github.io/Manatee.Json/usage/pointer.html)
Point at a specific place in a JSON!
* Examples:
  * Mapping from one object to another
  * Binding of one object to another (DOM)


### [JSON Schema](http://json-schema.org/understanding-json-schema/index.html)
Describing the structure a JSON need to be in.
* [Formly Playground](https://jsonform.github.io/jsonform/playground/index.html)
* Useful topics:
  * References (`$ref`) and recursive schemas
  * Conditional Schemas (`if`/`then`/`else`)
  * Schema aggregators
      * `allOf` (e.g. inheritance)
      * `oneOf` (exactly one)
      * `anyOf` (at least one)

### [JSON Patch](http://jsonpatch.com/)
Describe changes over a JSON
* Helps when updating:
  * Explicit deletion
  * Replacing specific array items
  * Testing before applyting the operation
