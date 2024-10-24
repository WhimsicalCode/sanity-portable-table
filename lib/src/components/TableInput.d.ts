/// <reference types="react" />
import { ObjectInputProps, BlockDefinition } from 'sanity';
import type { TableConfig } from '../types';
export declare function TableInput(props: ObjectInputProps & TableConfig): JSX.Element;
export declare function createTableInput(cellSchema: BlockDefinition): (props: ObjectInputProps) => JSX.Element;
