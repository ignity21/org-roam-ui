// Syntax highlighting for src blocks.  The light build of rehype-highlight
// only ships the languages registered here, which keeps highlight.js's ~190
// grammars out of the bundle; add a grammar below to highlight a new language.
// @ts-expect-error rehype-highlight has no type declarations
import rehypeHighlight from 'rehype-highlight/light'
// Loads highlight.js's declarations for its language modules.
import type {} from 'highlight.js'
import bash from 'highlight.js/lib/languages/bash'
import c from 'highlight.js/lib/languages/c'
import clojure from 'highlight.js/lib/languages/clojure'
import cpp from 'highlight.js/lib/languages/cpp'
import css from 'highlight.js/lib/languages/css'
import diff from 'highlight.js/lib/languages/diff'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import go from 'highlight.js/lib/languages/go'
import haskell from 'highlight.js/lib/languages/haskell'
import hy from 'highlight.js/lib/languages/hy'
import ini from 'highlight.js/lib/languages/ini'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import latex from 'highlight.js/lib/languages/latex'
import lisp from 'highlight.js/lib/languages/lisp'
import lua from 'highlight.js/lib/languages/lua'
import makefile from 'highlight.js/lib/languages/makefile'
import markdown from 'highlight.js/lib/languages/markdown'
import nix from 'highlight.js/lib/languages/nix'
import plaintext from 'highlight.js/lib/languages/plaintext'
import python from 'highlight.js/lib/languages/python'
import pythonRepl from 'highlight.js/lib/languages/python-repl'
import rust from 'highlight.js/lib/languages/rust'
import scheme from 'highlight.js/lib/languages/scheme'
import shell from 'highlight.js/lib/languages/shell'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'

export const highlightOptions = {
  // Blocks without a language stay plain rather than being guessed at.
  subset: false,
  // An unregistered language leaves the block plain instead of throwing.
  ignoreMissing: true,
  languages: {
    bash,
    c,
    clojure,
    cpp,
    css,
    diff,
    dockerfile,
    go,
    haskell,
    hy,
    ini,
    java,
    javascript,
    json,
    latex,
    lisp,
    lua,
    makefile,
    markdown,
    nix,
    plaintext,
    python,
    'python-repl': pythonRepl,
    rust,
    scheme,
    shell,
    sql,
    typescript,
    xml,
    yaml,
  },
  // Org Babel language names that highlight.js knows by another name.
  aliases: {
    lisp: ['elisp', 'emacs-lisp', 'common-lisp'],
    ini: ['conf', 'conf-toml', 'conf-unix', 'conf-space'],
    python: ['jupyter-python'],
    shell: ['sh-session'],
    javascript: ['js2', 'rjsx'],
  },
}

export { rehypeHighlight }
