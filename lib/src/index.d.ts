import type {BlockDefinition} from 'sanity'
import {Plugin as Plugin_2} from 'sanity'
import type {PortableTextBlock} from 'sanity'

export declare type Cell = {
  _key: string
  _type: 'table-cell'
  text: PortableTextBlock[]
}

export declare const portableTable: Plugin_2<TableConfig>

export declare type Row = {
  _key: string
  _type: 'table-row'
  cells: Cell[]
}

export declare type Table = {
  num_cols: number
  rows: Row[]
}

export declare interface TableConfig {
  cellSchema: BlockDefinition
  name?: string
  title?: string
}

export {}
