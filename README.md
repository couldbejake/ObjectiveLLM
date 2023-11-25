# ContextGPT [Terminal Magic]

A GPT agent that can build large programming projects

Demo [2023-11-25]: https://www.youtube.com/watch?v=53YrtNOPIWA

WIP - Still being built.

Sidenote:

Any methodology's routines to consolidate pieces of information over multiple contexts described in text, can also be described as a series of single or multi-bit encoding and arguments.
0001 - write a paragraph about a tree
0100 - describe the tree

But in terms of consolidating information, you can ex.store/get/read values etc...
You can bake it in. Or fine-tune with custom tokens inside training set, in a smaller LLM model of a complete system.

I think the easiest way is to filter input, and replace sequences of language tokens in training data, such as "{COMMAND_TOKEN} reply with negative sentiment" with an single bit encoding such as 0001. This way every time 0001 is seen, it's meaning will be inferred, seeing as GPT views everything as a series of numbers. Assuming the new token is associated with the original text meaning through natural language.