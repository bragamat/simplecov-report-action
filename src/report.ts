import * as core from '@actions/core'
import * as github from '@actions/github'
import replaceComment from '@aki77/actions-replace-comment'
import { markdownTable } from 'markdown-table'

export async function report(currentCoveredPercent: number, coveredPercent: number, failedThreshold: number): Promise<void> {
  const summaryTable = markdownTable([
    ['Current Coveragea', 'Covered', 'Threshold'],
    [`${currentCoveredPercent}%`, `${coveredPercent}%`, `${failedThreshold}%`]
  ])

  const pullRequestId = github.context.issue.number
  if (pullRequestId) {
    await replaceComment({
      token: core.getInput('token', { required: true }),
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: pullRequestId,
      body: `## Simplecov Report
  ${summaryTable}
  `
    })
  }

  await core.summary
    .addHeading('Simplecov Report')
    .addTable([
      [
        { data: 'Current Coverage', header: true },
        { data: 'New Coverage', header: true },
        { data: 'Threshold', header: true }
      ],
      [`${currentCoveredPercent}%`, `${coveredPercent}%`, `${failedThreshold}%`]
    ])
    .write()
}
