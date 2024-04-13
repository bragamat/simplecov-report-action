import path from 'path'
import * as core from '@actions/core'
import { report } from './report'

interface Result {
  result: {
    covered_percent?: number // NOTE: simplecov < 0.21.0
    line?: number
  }
}

async function run(): Promise<void> {
  try {
    const failedThreshold: number = Number.parseInt(core.getInput('failedThreshold'), 10)
    core.debug(`failedThreshold ${failedThreshold}`)

    const currentResultPath: string = core.getInput('currentResultPath')
    const resultPath: string = core.getInput('resultPath')
    core.debug(`currentResultPath ${currentResultPath}`)
    core.debug(`resultPath ${resultPath}`)

    const currentJson = require(path.resolve(process.env.GITHUB_WORKSPACE!, currentResultPath)) as Result
    const json = require(path.resolve(process.env.GITHUB_WORKSPACE!, resultPath)) as Result

    const currentCoveredPercent = currentJson.result.covered_percent ?? currentJson.result.line
    const coveredPercent = json.result.covered_percent ?? json.result.line

    if (coveredPercent === undefined) {
      throw new Error('Coverage is undefined!')
    }

    if (currentCoveredPercent === undefined) {
      throw new Error('Current Coverage is undefined!')
    }

    await report(currentCoveredPercent, coveredPercent, failedThreshold)

    if (coveredPercent < failedThreshold) {
      throw new Error(`Coverage is less than ${failedThreshold}%. (${coveredPercent}%)`)
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
