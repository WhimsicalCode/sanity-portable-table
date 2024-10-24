import React, { useCallback } from 'react';
import { MemberField, } from 'sanity';
import { set } from 'sanity';
import { Button, Inline, Stack, Card, Text } from '@sanity/ui';
import { randomKey } from '@sanity/util/content';
import { AddIcon, RemoveIcon } from '@sanity/icons';
function createTextBlock(text, cellSchema) {
    return {
        _key: randomKey(),
        _type: cellSchema.name,
        children: [
            {
                _key: randomKey(),
                _type: 'span',
                marks: [],
                text: text,
            },
        ],
        markDefs: [],
        style: 'normal',
    };
}
function createCell(text, cellSchema) {
    return {
        _key: randomKey(),
        _type: 'table-cell',
        text: [createTextBlock(text, cellSchema)],
    };
}
function createRow(cellCount, cellSchema) {
    return {
        _key: randomKey(),
        _type: 'table-row',
        cells: Array.from(Array(cellCount)).map((_, i) => createCell(`Cell ${i + 1}`, cellSchema)),
    };
}
function popColumn(rows = []) {
    return rows.map((row) => {
        const { cells, ...rest } = row;
        const newCells = [...cells];
        newCells.pop();
        return {
            ...rest,
            cells: newCells,
        };
    });
}
function appendColumn(rows = [], cellSchema) {
    return rows.map((row) => {
        const { cells, ...rest } = row;
        return {
            ...rest,
            cells: [...cells, createCell(`Cell ${cells.length + 1}`, cellSchema)],
        };
    });
}
function locateMember(members, key) {
    return members.find((member) => member.kind === 'field' && member.name === key);
}
export function TableInput(props) {
    const { members, onChange, value, renderInput, cellSchema } = props;
    const rowsMember = locateMember(members, 'rows');
    const addColumn = useCallback(() => {
        const num_cols = value?.num_cols + 1 || 1;
        const rows = appendColumn(value?.rows, cellSchema);
        onChange(set({ ...value, rows, num_cols }));
    }, [onChange, value, cellSchema]);
    const removeColumn = useCallback(() => {
        if (value?.num_cols === 1)
            return;
        const num_cols = value?.num_cols - 1 || 1;
        const rows = popColumn(value?.rows);
        onChange(set({ ...value, rows, num_cols }));
    }, [onChange, value]);
    const rowsInput = useCallback(
    // TODO InputProps doesn't have onInsert on it for some reason?
    (inputProps) => {
        const handleInsert = () => {
            const { rows, num_cols } = value;
            return onChange(set({ ...value, rows: [...rows, createRow(num_cols, cellSchema)] }));
        };
        return renderInput({ ...inputProps, onInsert: handleInsert });
    }, [value, onChange, cellSchema, renderInput]);
    return (<Stack>
      <Card padding={1} paddingBottom={4}>
        <Inline space={2}>
          <Button icon={RemoveIcon} mode="ghost" onClick={removeColumn}/>
          <Text>
            {value?.num_cols ?? 1} {value?.num_cols === 1 ? 'Column' : 'Columns'}
          </Text>
          <Button icon={AddIcon} tone="primary" onClick={addColumn}/>
        </Inline>
      </Card>

      {rowsMember && (<MemberField member={rowsMember} renderInput={rowsInput} renderField={props.renderField} renderItem={props.renderItem} renderPreview={props.renderPreview} renderBlock={props.renderBlock} renderAnnotation={props.renderAnnotation}/>)}
    </Stack>);
}
export function createTableInput(cellSchema) {
    return (props) => <TableInput {...props} cellSchema={cellSchema}/>;
}
