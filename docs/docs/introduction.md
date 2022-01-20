---
sidebar_position: 1
---

# Introduction

⚡️ Grit will help you build **production-ready projects faster**

🎯 Writing boilerplate code sucks. Instead, **focus on your core project** and use Grit generators to scaffold configs and integrations.

❌ Eliminate repetitive tasks and **Never write the same code twice** by creating your own generators in **seconds**

😎 Discover popular Grit generators built by the community to speed up your workflows

🏭 Grit is a **scaffolding tool** built to speed up a developers workflow through the use of **reusable code generators**. Grit generators are run in the command line with the **Grit CLI** where they gather information from users to **perform file manipulations**. Generators have access to a libray of useful methods that allow them to perform **nearly any task**, so there is no limit to what Grit can do

## Motivation

Grit was concieved out of the tedious experiance of setting up web application boilerplate code. I quickly found much of the work i was doing to begin a new project was boilerplate building and configuring developer tooling. It is not uncommon for this work to take many days if not weeks to setup and test all before a single line of business logic is written.

> The current solutions to this issue left me very unsatisfied and hungry for an elegant solution

### Most Templates/Boilerplates are not usable

- Dependencies become oudated quickly
- Vulerabilities and incompatibilies
- Bad or inefficient application architecture
- Not optimised for getting to production
- Too many or too few features
- Even good ones require extensive customization

After lots of research and testing i found that modularity is likely the solution to these issues as it allows for assembly of the project skeleton through composition of many individually maintained and decoupled plugins. Discovering that scaffolding tools were the perfect solution i was unimpressed with the implimentations already out there as they either lacked features or were too complicated to develop for

### Yeoman is too complicated

Yeomans overly complex approach to building generators creates a barrier to entry for developers and a lack of new generators

## What is a Generator?

A generator is a reusable piece of software created by a developer to scaffold out files to avoid reperitive tasks or boilerplate code setup.

Generators are essentially just highly abstracted and opinionated ways of moving, manipulating, creating, and deleting, files based on input from a user in a question-answer format. They have a built-in library of functions availiable for quickly performing typically tedious file operation tasks in a repeatable and endlessly extensible way.

With just a few lines of code you can create your own generator to avoid writing the same boilerplate code ever again. Then publish your generator to npm and any Grit user will have access to your solution instantly to speed up their own workflows.

### Using generators

The Grit-CLI is designed to run and manage Grit generators on your machine in a seamless manner. You can discover new generators from the community, keep them updated, and run them anywhere in a simple and intuitive CLI environment.

## Features

### Community

Grit was built with community in mind. Publishing generators to npm makes them instantly discoverable by anyone else using grit all from inside the CLI.

### Speed

Grit is crazy fast! It can scaffold out whole web applications in under 100ms.

### Offline use

Grit generators are always cached locally on your machine so you can run them anytime anywhere even without internet connection.

> While you can run your generator locally without internet connection, you will not be able to install any dependencies or install new generators from npm

### Developer Centric Design

The entire genesis for Grit is the desire to provide the best developer experiance when creating genrators. Scaffolding tools are only as useful as the developers who use and maintain them so much care was put into making the framework work easily for any level of generator complexity.

#### Typescript support

Typescript is a great language to use to inspire more confidence in your code and make it easier to refactor and maintain. Grit is built with typescript and provides Great type definitions for writing generators. This fact alone has drastically reduced the amount of time needed to spend in the Grit docs when writing the [generator file](generator-file/overview).

The benefits of writing generators in typescript don't stop there though. Grit has built in transpilation support for directly running typescript generators in the command line. Now you don't have to worry about transpiling your generators to javascript before testing or publishing them which can significaltly speed up the development time.

#### Generators are modular

Generators can be composed together through `generator chaining`, which allows you to leverage other generators to enhance the scope of your own generators without having to write them all yourself.

##### example

Let's take the example of building a generator for scaffolding out the boilerplate code for an NPM package. If i wanted to include jest, eslint, and prettier in my package i would ordinarily have to build those into the generator itself. Instead, with generator chaining, i can simply chain the jest, eslint, and prettier generators from the community in my own generator and save significant amounts of time and effort letting them scaffold their own files.

#### Hot rebuilding

Testing the final output of a generator is conventionally difficult for more complex generators due to the number of varables possible with the user prompting. Grit provides hot rebuilding of projects so you can make changes to the source files and see them instantly reflected in the output rather than having to re-run the generator. ts

This is especially useful for generators designed to output web-applications as it allows you to install dependencies and test out the functionality of the application in a production environment. If you need to make small tweaks you just change the generator source and it is instantly reflected in the output without having to re-run the generator.

The file watch feature is also smart enough to know exactly what portion of the generator source was altered and will automatically install updated dependencies on the output if any dependencies were added updated or removed.

#### Mock mode for automated testing

Testing generators is very important and is made very easy with the Grit mock mode. Mock mode outputs all generator files into the OS temp directory and does not install dependencies. You can provide the mocked generator with answers to the prompts and it will use those without having to obtain answers from the terminal. Additionally the generator instance comes built in with methods to read the mocked output and assert the output against what is expected, or against snapshots. You can test endless numbers of varations of user input all automatically and in a CI/CD environment if desired.

#### Debug mode

The `gritenv` package used to build generators provides a useful console logger that can be used for debugging your generators. You can include as many console logs as you want specifying the `debug` level of logging. This will then only show the logging to the console when you use the debug flag while running the generator.
