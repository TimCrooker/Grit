#!/usr/bin/env node
import { runCLI } from './cli'
import { handleError } from '../error'

runCLI().catch(handleError)
