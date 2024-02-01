Rawline-Black-NumbersOnly is a subset of Rawline-Black that includes only the characters below:

* Numbers from 0 to 9 - unicode characters range U+0030-0039
* `€` - unicode character U+20AC
* `$` - unicode character U+0024
* `-` - unicode character U+002D
* `.` - unicode character U+002E
* `:` - unicode character U+003A
* `,` - unicode character U+002C

All included characters: U+0030-0039,U+20AC,U+0024,U+002D,U+002E,U+003A,U+002C

Anytime we need to include new characters, please check the table at https://www.rapidtables.com/code/text/unicode-characters.html

Commands used to generate this font subset:

```
$ pyftsubset Rawline-Black.woff --unicodes=U+0030-0039,U+20AC,U+0024,U+002D,U+002E,U+003A,U+002C --output-file=Rawline-Black-NumbersOnly.woff --flavor=woff
$ pyftsubset Rawline-Black.woff2 --unicodes=U+0030-0039,U+20AC,U+0024,U+002D,U+002E,U+003A,U+002C --output-file=Rawline-Black-NumbersOnly.woff2 --flavor=woff2
```

Requirements to generate a new font subset:

* Python
* pip
* fonttools (includes the `pyftsubset` tool, install with `pip install fonttools`)
* brotli (required to export woff2, install with `pip install brotli`)
