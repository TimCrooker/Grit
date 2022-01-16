---
sidebar_position: 2
---

# Getting Started

## Requirements

- [Node.js][https://nodejs.org/en/download/] version >= 14 or above (which can be checked by running node -v).
- [Yarn](https://classic.yarnpkg.com/en/) version >= 1.5 (which can be checked by running yarn --version). Yarn is a performant package manager for JavaScript and replaces the npm client. It is not strictly necessary but highly encouraged.

## Installation

Install Grit globally onto your machine with npm

```bash
npm install -g grit-cli
```

you now have access to Grit anywhere in the terminal

## Jump into Grit

Follow this short guide to what Grit can do

### 1. Access the GUI

To access the home screen of the graphical interface, open a new terminal window and run the `grit` command

```bash
grit
```

This is the home screen. From here you can easily navigate all of the Grit functionality and manage your generators.

![image info](/img/tutorial/terminalSC/grit-command-sc.png)

### 2. Install the example generator

Installing generators is super easy. Just use the install command, followed by the name of the generator you want to install.

```bass
grit install example
```

### 3. View installed generators

Now you have the grit-example generator installed on your machine. To view your installed generators, run the `grit` command again to go to the home screen.

![image info](/img/tutorial/terminalSC/grit-command-sc-wgen.png)

### 2. Discover new generators

Read more about this feature [here](usage/find)

## Basic Usage

The Grit CLI has a variety of commands availiable for running and managing your generators, but additionally there is a full console based UI built on top of these commands. This makes it easy to use grit in its entirety without even glancing at the docs for the commands. All of the Grit features are accessible though both methods so you can run CLI commands directly in the terminal, or you can use the UI to navigate the application visually.

Proceed through the usage docs for details on all of the commands Grit provides.
