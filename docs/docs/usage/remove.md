# Remove

In case you need fresh installs or to clear clutter, you can use the `remove` command to delete generators from your machine.

## From the command line

## Remove a specific generator

When you know the name of the generator you want to remove from your machine, then use the `remove` command as shown to remove it directly:

```bash
grit remove <generator-name>
#generator-name: the name of the generator you want to run (required)
```

> You will recieve an error if you try to remove generators that are not installed

## Remove all generators

If you want a fresh start then use the `--all` option with the `remove` command to remove all of your installed generators

```bash
grit remove --all
```

## List generators to remove

To view a list of installed generators to remove, use the `remove` command by itself:

```bash
grit remove
```

This command will show the following screen where you can select generators to remove directly from the list

![image info](/img/tutorial/terminalSC/remove-list.png)

## From home screen

Using the `grit` command to view the home screen will present you with a list of options. Choosing the shown `Delete Generators` option will present you with the list of installed generators mentioned [above](#list-generators-to-remove) where you can quickly uninstall them from your machine.

![image info](/img/tutorial/terminalSC/delete-from-home.png)
