# Completed

The completed section is similar to the [Prepare](create-generator/generator-file/prepare) section in that there is no single designated use case. There are quite a few specific use-cases however, that are commonly seen and very useful

## Common Use-Cases

### Git

#### Initialize Repo

Grit has a method for initializing a git repo in the generator output directory. This is nice if you want to further shrink the number of things a user of your generator has to worry about.

#### Create Commits

Grit has a method for creating git commits that takes in only a message argument. This allows you to automatically create commits with any message on the users repository.

### Running Scripts

Grit has 2 methods for running scripts. A general script runner that can run any terminal command in a separate thread. Additionally there is an abstracted method that will run npm scripts from the package.json of the output files. This is great for automatically running builds, serving files, running tests, or any other use case you can derive from the scripts in a package.json.

### Displaying Success Message

Grit has a simple method for displaying a success message to the user indicating that the generator completed successfully.

### Generator Chaining

You can read more about generator chaining in other sections of the docs, but this is very useful for composing endless number of smaller generators into large complex generators with very little effort.
