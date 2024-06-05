'use client';

import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from '@/styles/table.module.scss';
import { IContentsTableRow } from '@/types';
import Span from '../Font/Span';
import { TableProps } from './Table';

export type ContentsTableProps = {
  /**
   * Row Datas
   */
  rowDatas: IContentsTableRow[];
};

/**
 * 게시글 테이블 (별도 생성)
 * @see styles https://codepen.io/_fhdamd/pen/JRRRZX
 */
const ContensTable = ({ rowDatas }: ContentsTableProps) => {
  const fields: TableProps<IContentsTableRow>['fields'] = React.useMemo(
    () => [
      {
        headerName: '번호',
        field: 'seq',
        width: '60px',
      },
      {
        headerName: '카테고리',
        field: 'subName',
        ui: 'small',
        width: '80px',
      },
      {
        headerName: '제목',
        field: 'title',
        ui: 'link',
        path: '/contents',
      },
      {
        headerName: '날짜',
        field: 'regDt',
        width: '60px',
      },
    ],
    [],
  );

  return (
    <table className={clsx(styles['table_latitude'])}>
      <thead>
        <tr>
          {fields.map((column, idx) => (
            <th
              key={`thead-tr-${idx}`}
              style={{
                width: column.width,
              }}
            >
              <p>{column.headerName}</p>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(rowDatas.length || 0) === 0 && (
          <tr className={styles.nodata}>
            <td colSpan={fields.length}>
              <Span>게시글이 없습니다.</Span>
            </td>
          </tr>
        )}
        {rowDatas.map((row, idx) => (
          <tr key={`tbody-tr-${idx}`}>
            {fields.map((column, columnIdx) => {
              const item = row[column.field];

              if (column.field === 'title') {
                return (
                  <td
                    key={`tbody-tr-${idx}-td-${columnIdx}`}
                    className={clsx({
                      [styles['table_latitude_small']]: column.ui === 'small',
                      [styles['table_latitude_link']]: column.ui === 'link',
                    })}
                    style={{
                      width: column.width,
                    }}
                  >
                    <Link href={[column.path || '', row.seq || ''].join('/')}>
                      {item} <Span color="info">({row.commentCnt || 0})</Span>
                    </Link>
                  </td>
                );
              }

              return (
                <td
                  key={`tbody-tr-${idx}-td-${columnIdx}`}
                  className={clsx({
                    [styles['table_latitude_small']]: column.ui === 'small',
                    [styles['table_latitude_link']]: column.ui === 'link',
                  })}
                  style={{
                    width: column.width,
                  }}
                >
                  {item}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ContensTable;
