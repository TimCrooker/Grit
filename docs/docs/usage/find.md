# Find

Grit provides the `find` command as a convienience method for finding and intalling new useful generators all without leaving the cli

## Browse generators to install

If you don't know what generator you want to install, you can use the [`find`](usage/find) command to discover generators made by other developers:

```bash
grit find
```

Using this command will bring you to the following screen where you can browse a list of publically available generators ranked in order of popularity:

![image info](/img/tutorial/terminalSC/grit-find-sc.gif)

### From the home screen

Alternativley to using the `find` command directly, you can select the shown option on the home screen to do the same thing.

![image info](/img/tutorial/terminalSC/discover-generator.png)

## Search for generators

If you know a keyword of a generator type you are looking for but don't know the exact name of it, you can use the `find` command with a search term to search for generators:

```bash
grit find <search-term>
```

This command will either find no generators matching the search query, or will show the following screen where you can select any generators from the list to install them

![image info](/img/tutorial/terminalSC/grit-search.gif)
