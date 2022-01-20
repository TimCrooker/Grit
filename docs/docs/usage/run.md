# Run

To actually run a generator you have the `run` command. This command will first install the generator to your machine if you don't already have it, and then run it.

## From command line

```bash
grit <generator-name> [output-directory] [options]

#generator-name: the name of the generator you want to run (required)
#output-directory: the directory name or path you want the generator to output to (optional)
```

The output directory argument will default to the current working directory.

This command additionally supports many flags that can be used to control the generators behavior:

| options             | Description                                         | Default        |
| ------------------- | --------------------------------------------------- | -------------- |
| -d, --debug         | run the generator with more logging                 | false          |
| -u, --update        | will force update the generator before running      | false          |
| -s, --silent        | run the generator without any logging               | false          |
| -c, --clone         | git clone repo generators instead of downloading it | false          |
| -m, --mock          | mock the generator for testing purposes             | false          |
| -h --hot-rebuild    | rebuild a local generator when changes are made     | false          |
| --npm-client client | use a specific npm client ('yarn', 'npm')           | yarn if avail. |
| -n --skip-install   | skip installing dependencies                        | false          |

## From home screen

Simply using the `grit` command you can navigate to the Grit home screen. Here you will be shown a list of your already installed generators. Selecting any of these will run it immediately.

```bash
grit
```

![image info](/img/tutorial/terminalSC/grit-command-sc-wgen.png)
