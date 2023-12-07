# ObjectiveLLM [Terminal Magic]

A GPT agent that can build large programming projects

Demo [2023-11-25]: https://www.youtube.com/watch?v=53YrtNOPIWA

If you want to try it

1. copy .env.example to .env
2. check that main menu is selected by default in Terminal.js (this.currentMenu)
3. Either run:

`node main.js` - Automatically gets GPT to talk to the terminal

OR

`node VirtualTerminal/Terminal.js` - Will let you manually use the terminal

- Ensure the TestBed folder is created under IDE
- Make sure you trust folders of the project, the first time the IDE runs, otherwise all teriminal commands + debugging will return no result.

---

WIP - Still being built.

Sidenote:

Any methodology's routines to consolidate pieces of information over multiple contexts described in text, can also be described as a series of single or multi-bit encoding and arguments.
0001 - write a paragraph about a tree
0100 - describe the tree

But in terms of consolidating information, you can ex.store/get/read values etc...
You can bake it in. Or fine-tune with custom tokens inside training set, in a smaller LLM model of a complete system.

I think the easiest way is to filter input, and replace sequences of language tokens in training data, such as "{COMMAND_TOKEN} reply with negative sentiment" with an single bit encoding such as 0001. This way every time 0001 is seen, it's meaning will be inferred, seeing as GPT views everything as a series of numbers. Assuming the new token is associated with the original text meaning through natural language.

Reply to a message:

"""

I have setup GPT to interact with an interactive terminal, where it can run commands get an output.

Currently the only implemented options are tasks and sub tasks.

I plan to implement the following:

Menus:

Tasks (Create a program) - Contains tasks
Sub Tasks (Install req) - contains sub tasks
Diary - contains a list of previous menu actions
Objectives - the current objective, can change over time
Notes - allows GPT to keep notes

+ the ability for GPT to debug code using a debugger and connection to an IDE.

Features:

Ability to talk to other agents such as Code Llama
Interaction with OS level using Accessibility tools

The idea is that every time the context is reset, we reset the menu back to the start, but keep the context items.

When the context resets, GPT has the option to write a note for its future self to guide generation, and prevent hallucinations

GPT should continue from its last place using a comprehensive description of previous attempted tasks (summarization, pagination)

I believe the ability for GPT to navigate the terminal freely allows GPT to act as a more independent "virtual entity" - (GPT's words).

In addition, I have thought of a few solutions to the infinite loop problem AutoGPT has encountered.

What makes this project different from AutoGPT is the granularity of thought processes, the virtual terminal - which can drive autonomy, and allow GPT to revisit tasks, but also allow continuation of context across context histories.

I have written code to allow GPT to demo what I have created so far, Please let me know what you think.

"""

aims: non-imperative context, terminal interaction, intent consistency
