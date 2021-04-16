## Gourcify

Convert a directory of git repos into a single history to rendered by [gource][]


## Requirements

* [gource][]
* [libvips][] - required by [sharp][]

## Installation

```shell
$ npm install
```

## Running

```
node . <options>
```

### Options

Options can be specified with either command line arguments or environemnt variables

#### Command line arguments

* inputdir (path): The directory to search for git repositories
* outputdir (path): the directory to render history files for gource
* gource:filename (string) [gource.txt] The final history file name to use for rendering

#### Environemnt Variables

* INPUTDIR (path): The directory to search for git repositories
* OUTPUTDIR (path): the directory to render history files for gource
* GOURCE__FILENAME (string) [gource.txt] The final history file name to use for rendering

[gource]: https://gource.io
[libvips]: https://github.com/libvips/libvips
[sharp]: https://www.npmjs.com/package/sharp

