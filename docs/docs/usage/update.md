# Update

Updating generators to the newest versions is made easy with the `update` command. Grit will check if there is a newer version of a generator available and if so, it will be installed for you.

## From command line

```bash
grit update <generator-name> [options]

#generator-name: the name of the generator you want to update (required)
```

options:

| options   | Description                              | Default |
| --------- | ---------------------------------------- | ------- |
| -a, --all | install all availiable generator updates | false   |

### Update a specific generator

For instances where you want to directly update an already installed generator, you can use the `update` command with the name of the generator to update:

> Using the update command on an already installed generator will install the newest version of it even if it is already up to date.

```bash
grit update <generator-name>
```

### List generators with available updates

To view a list of installed generators that have updates available then use the update command with no arguments or options:

```bash
grit update
```

Selecting a generator from the list will install the newest version of it.

![image info](/img/tutorial/terminalSC/update-list.png)

### Update all generators

If you want to update all of the generators on your machine then use the following command to install all availiable updates:

```bash
grit update --all
```

## From home screen

Using the `grit` command to view the home screen will present you with a list of your installed generators. Additionally though, it will let you know if there are any installed generators with available updates. Selecting a generator from the list will allow you to quickly update it before running it, or choose to just update and not run it at all.

![image info](/img/tutorial/terminalSC/update-available.png)
