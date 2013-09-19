# E130 Pal
#### Build, Test, and Decipher the E130 Tag within Blackbaud's Luminate CRM

## Overview:

The E130 Pal helps to visually see how the E130 tag is executed within Blackbaud's Luminate CRM.

Uses include seeing how expressions are handled, building your own expressions, and learning more about the power of E130.

Included in E130 is command documentation, a stack trace so you can see what it is doing, and the ability to add tags/values to build more complex expressions.

## Examples:

```
[[E130:1 2 + 4 + [[S1:first_name]]]]
```

```
[[E130:1 4 < 2 4 < &&]]
```

```
[[E130:"http://shortname.convio.net/site/TR?fr_id=1000&px=1234567&pg=personal" dup dup length swap "fr_id=" indexof 6 + swap substring dup "&" indexof dup 0 < 1000 0 ? + 0 swap substring]]
```

## Operations:

The following operations are supported:

* `==`
* `!`
* `<`
* `>`
* `?`
* `+`
* `-`
* `*`
* `/`
* `&&`
* `||`
* `int`
* `number`
* `string`
* `currency`
* `dup`
* `pop`
* `swap`
* `min`
* `max`
* `length`
* `concat`
* `indexof`
* `lastindexof`
* `nextindexof`
* `substring`
* `replaceall`
* `stringcount`
* `roundmult`
* `compare`
* `stackcount`
* `printstack`
* `help`

## Links:

[E130 Pal](http://eduar.de/tools/e130/)

More examples plus a full reference (with examples as well) are built into the tool.