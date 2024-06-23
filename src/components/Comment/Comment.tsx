'use client';

import React, { useState, useRef, useCallback } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import { MdOutlineDelete } from 'react-icons/md';
import Button from '../Button/Button';
import Input from '../Input/Input';
import styles from '@/styles/contens.module.scss';
import FlexBox from '../Box/FlexBox';

export type CommentProps = {
  title: string;
  regDt: string;
  body: string;
  children?: React.ReactNode;
  /**
   * 수정 기능
   * @returns
   */
  onEdit?: (newValue: string) => void;
  /**
   * 삭제 기능
   * @returns
   */
  onDelete?: () => void;
};

/**
 * 댓글 기본 UI
 * @param param0
 * @returns
 */
const Comment: React.FC<CommentProps> = ({
  title,
  regDt,
  body,
  children,
  onDelete,
  onEdit,
}) => {
  const [editMode, setEditMode] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputCallback = useCallback((ele: HTMLInputElement | null) => {
    ele?.focus();
    inputRef.current = ele;
  }, []);

  return (
    <div className={styles.comment_item}>
      <FlexBox
        className="mb-1"
        style={{
          columnGap: '0.5em',
        }}
      >
        <span className={styles.noname_title}>{title}</span>
        <span className={styles.noname_regdt}>{regDt}</span>
        {onEdit && (
          <>
            <Button
              icon
              size="sm"
              variant="text"
              onClick={() => {
                setEditMode((b) => !b);
                inputRef.current?.focus();
              }}
            >
              <FiEdit3 />
            </Button>
            {editMode && (
              <Button
                size="sm"
                variant="text"
                onClick={() => {
                  const newValue = inputRef.current?.value || body;
                  onEdit(newValue);
                }}
                color="success"
              >
                저장
              </Button>
            )}
          </>
        )}
        {!editMode && onDelete && (
          <Button
            icon
            size="sm"
            variant="text"
            onClick={() => onDelete()}
            color="danger"
          >
            <MdOutlineDelete />
          </Button>
        )}
      </FlexBox>
      {editMode ? (
        <Input ref={inputCallback} defaultValue={body} />
      ) : (
        <p
          dangerouslySetInnerHTML={{
            __html: body,
          }}
        />
      )}
      {children}
    </div>
  );
};

export default Comment;
