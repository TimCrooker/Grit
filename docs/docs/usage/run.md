# Run

## Run a specific generator

To actually run a generator you can use the `grit` command, followed by the name of the generator you want to run. This command will first install the generator to your machine if you don't already have it, and then run it.

```bash
grit <generator-name> [output-directory] [options]

#generator-name: the name of the generator you want to run (required)
#output-directory: the directory name or path you want the generator to output to (optional)
#options: any options you want to run the generator with (optional)
```

The output directory argument will default to the current working directory.

This command additionally supports many flags that can be used to control the generators behavior as shown below:

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

## Run an installed generator

To run your installed generators from a list, navigate to the Grit CLI [home](#home) and press enter on any of the generators it shows to run them.