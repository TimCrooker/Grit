#!/usr/bin/env node
import { runCLI } from '@/cli/cli'
import { handleError } from '../error'
runCLI().catch(handleError)
