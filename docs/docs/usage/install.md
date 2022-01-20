# Install

Grit includes the `install` command which gives you a few ways to quickly install new generators onto your machine.

## Install a specific generator

If you already know what generator you would like to install then you can use the following command which simply installs it on your machine:

```bash
grit install <generator>
#generator: the name of the generator you want to run (required)
```

## Install a specific version of a generator

Grit allows you to install any version of a generator with the use of the `@` symbol as shown below:

> This installs specifically version 1.0.0 of the generator but will display an error if you try to install a version that doesn't exist. It is recommended you only use this if you know what you are doing.

```bash
grit install example@1.0.0
```

## Repo Generators

All of the examples you have seen so far have been installed from npm. Alternativly if you want to use a generator that is not published on npm, you can point grit to a repository that contains the generator. All you need to do is provide grit with a url or scoped repository name.

> This feature only supports github and gitlab at the moment.

```bash
#install via url
grit install https://github.com/TimCrooker/grit-example

#install via scoped repository name
grit install TimCrooker/grit-example
```

You will now be able to access the generator from the home screen identified by the `<username>/<repo-name>` schema along with the git branch

![image info](/img/tutorial/terminalSC/example-repo-generator.png)
