import { Command } from 'commander'
import pkg from '../../package.json'

const program = new Command()
program.name(pkg.name).version(pkg.version)

export { program }
