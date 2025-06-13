import { Summary } from './model/index.ts'
import { StatementSync } from 'node:sqlite'

const vegaSchema = 'https://vega.github.io/schema/vega-lite/v5.json'

const parseSummaryData = (stmt: StatementSync) =>
  JSON.parse(
    ((row) =>
      row && row['data'] instanceof Uint8Array
        ? new TextDecoder().decode(row['data'])
        : '')(
        stmt.get(),
      ),
  )

const osPie = (stmt: StatementSync): string => {
  const summary: Summary = parseSummaryData(stmt)
  const values = Object.entries(summary.os ?? {}).map(
    ([name, count]) => ({ os: name, c: count }),
  )
  return JSON.stringify({
    $schema: vegaSchema,
    title: 'Operating Systems',
    description: 'Distribution of operating systems used by clients',
    data: {
      values: values,
    },
    mark: {
      type: 'arc',
      tooltip: true,
    },
    encoding: {
      theta: {
        field: 'c',
        type: 'quantitative',
        stack: 'normalize',
        title: 'Percentage',
      },
      color: {
        field: 'os',
        type: 'nominal',
        sort: {
          field: 'c',
          order: 'descending',
        },
        title: 'Operating System',
      },
      order: {
        field: 'c',
        type: 'quantitative',
        sort: 'descending',
        title: 'Count',
      },
    },
  })
}

const numInstanceLine = (stmt: StatementSync): string => {
  const values = [{}]
  for (const row of stmt.iterate()) {
    const dt = new Date(row.time as string).toISOString().slice(0, 10)
    const s: Summary = JSON.parse(
      new TextDecoder().decode(row.data as Uint8Array),
    )

    Object.entries(s.versions ?? {}).forEach(
      ([version, count]) => values.push({ v: version, n: count, d: dt }),
    )
    values.push({
      v: 'all',
      n: s.numInstances,
      d: dt,
    })
  }
  return JSON.stringify({
    $schema: vegaSchema,
    title: 'Number of Instances Over Time',
    description: 'Number of instances of the server over time, by version',
    data: {
      values: values,
    },
    height: 500,
    width: 1000,
    mark: {
      type: 'line',
      tooltip: true,
      point: true,
    },
    encoding: {
      color: {
        field: 'v',
        type: 'nominal',
        sort: {
          field: 'n',
          op: 'sum',
          order: 'descending',
        },
        title: 'Version',
      },
      x: {
        field: 'd',
        type: 'temporal',
        timeUnit: 'yearmonthdate',
        title: 'Date',
      },
      y: {
        field: 'n',
        type: 'quantitative',
        title: 'Number of Instances',
      },
    },
  })
}

const musicFsPie = (stmt: StatementSync): string => {
  const summary: Summary = parseSummaryData(stmt)
  const values = Object.entries(summary.musicFS ?? {}).map(
    ([type, count]) => ({ fs: type, c: count }),
  )

  return JSON.stringify(
    {
      $schema: vegaSchema,
      title: 'Music File Systems',
      description: 'Distribution of file systems used for music files',
      data: {
        values: values,
      },
      mark: {
        type: 'arc',
        tooltip: true,
      },
      encoding: {
        theta: {
          field: 'c',
          type: 'quantitative',
          stack: 'normalize',
          title: 'Percentage',
        },
        color: {
          field: 'fs',
          type: 'nominal',
          sort: {
            field: 'c',
            order: 'descending',
          },
          title: 'File System (music)',
        },
        order: {
          field: 'c',
          type: 'quantitative',
          sort: 'descending',
          title: 'Count',
        },
      },
    },
  )
}

const dataFsPie = (stmt: StatementSync): string => {
  const summary: Summary = parseSummaryData(stmt)
  const values = Object.entries(summary.dataFS ?? {}).map(
    ([type, count]) => ({ fs: type, c: count }),
  )

  return JSON.stringify(
    {
      $schema: vegaSchema,
      title: 'Data File Systems',
      description: 'Distribution of file systems used for data files',
      data: {
        values: values,
      },
      mark: {
        type: 'arc',
        tooltip: true,
      },
      encoding: {
        theta: {
          field: 'c',
          type: 'quantitative',
          stack: 'normalize',
          title: 'Percentage',
        },
        color: {
          field: 'fs',
          type: 'nominal',
          sort: {
            field: 'c',
            order: 'descending',
          },
          title: 'File System (data)',
        },
        order: {
          field: 'c',
          type: 'quantitative',
          sort: 'descending',
          title: 'Count',
        },
      },
    },
  )
}

const playerTypePie = (stmt: StatementSync): string => {
  const summary: Summary = parseSummaryData(stmt)
  const values = Object.entries(summary.playerTypes ?? {}).map(
    ([name, count]) => ({ pt: `${name}: ${count}`, c: count }),
  )

  return JSON.stringify(
    {
      $schema: vegaSchema,
      title: 'Player Types',
      description: 'Distribution of clients used',
      data: {
        values: values,
      },
      mark: {
        type: 'arc',
        tooltip: true,
      },
      encoding: {
        theta: {
          field: 'c',
          type: 'quantitative',
          stack: 'normalize',
          title: 'Percentage',
        },
        color: {
          field: 'pt',
          type: 'nominal',
          sort: {
            field: 'c',
            order: 'descending',
          },
          title: 'Client',
        },
        order: {
          field: 'c',
          type: 'quantitative',
          sort: 'descending',
          title: 'Count',
        },
      },
    },
  )
}

export { dataFsPie, musicFsPie, numInstanceLine, osPie, playerTypePie }
