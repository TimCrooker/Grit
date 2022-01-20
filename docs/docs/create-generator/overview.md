# Overview

## Anatomy of a Generator

Generators can be as simple or as complex as is neccessary to generate the ouput they require. A barebones example file structure of a generator is as follows:

```
📦example-generator
┣ 📂plugins // plugins directory
 ┣ 📂firstPlugin
 ┣ 📂secondOne
┣ 📜grit.config.js // generator file
┣ 📂template // template directory
 ┣ 📜README.md
```

### Template

The template directory contains all of the main files that a generator has access to at runtime. The file-tree structure of the contents of this directory will be directly reflected by the output of the generator to the specified output directory.

The simplest possible generator consists nothing but a template directory. In this case grit will use a default configuration that simply copies the files to the destination directory and performs no further manipulations.

There are no limits on the type or number of files or directories that can be included

#### EJS transformation

Grit takes advantage of the [EJS](https://ejs.co/) javascript templating engine to transform the files inside the template directory based on answers recieved from users at generator runtime.

The key benefit of this process is the ease of injecting custom variables into the template files. This may sound confusing at first but the below example should give you a better idea of how this works.

**Example:**

Assume we have a simple generator structured as follows

```
📦example-generator
┣ 📜grit.config.js
┣ 📂template
 ┣ 📜README.md

// contents of README.md
# Hello from <%= name %>
```

When executed, this generator only asks one question to obtain the string varaible `name`:

```typescript
? What is your name? > John
```

Since the user submitted the string 'John' as the answer, the varable `name` will be set to 'John' in the generator

After the generator outputs its files you see that the README.md file actaully contains the following content:

```markdown
# Hello from John
```

The variable `name` is injected directly into the template files to be used by the EJS preprocessor, indicated by the `<%=` opening tag and `%>` closing tag. These tags can encapsulate javascript code or variables provided by the generator to easily transform code output inside of a file.

It is highly recommended that you read the [EJS docs](https://ejs.co/) to become familiar with this powerful feature.

### [Generator File](generator-file/overview)

The generator file defines all of the generator logic and is the central locus of control for the everything the generator does.

### Plugins

Grit plugins are a very useful mechanism for extending generator functionality in a modular way.
