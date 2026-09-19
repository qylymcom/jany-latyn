# Contributing

Disagreement is the point of this project. A reproducible case where the engine
corrupts native Kyrgyz, or where the whitepaper argues something false, is worth
more than agreement.

## Where contributions go

**`packages/engine/` — pull requests welcome.** MIT licensed. Inbound equals
outbound: by submitting a change you agree it is licensed to the project and to
everyone else under the MIT license, and you keep the copyright in your own
work. Sign your commits off with the Developer Certificate of Origin
(`git commit -s`), which records that you wrote the change or have the right to
submit it.

**`apps/web/` — issues and bug reports, not pull requests for now.** The web
application is under a source-available license, and accepting patches into it
without a contributor agreement would leave its licensing ambiguous. If you have
a fix, open an issue describing it. If there is enough interest, a contributor
license agreement will be added so that this directory can take patches too.

**`docs/` — corrections welcome as issues.** The whitepaper is a signed argument
rather than a collaborative document, so changes to it go through discussion
first. Factual errors, bad examples, and mistranslations are the most valuable
reports.

## What makes a good report

- A word or sentence, the configuration you used, what the engine produced, and
  what you expected. Native-speaker judgments are evidence; please say if you
  are one and which variety you speak.
- For the whitepaper: the section, the claim, and why it is wrong. A source
  helps but is not required.

## Tests

`npm test` runs the engine suite, the codepoint inventory test, and the
conformance checker that verifies every transliteration example in the
whitepaper against the engine. A change that alters conversion behavior must
either keep those passing or come with an explanation of why the expected
behavior changed.

## Contact

salam@qylym.com
