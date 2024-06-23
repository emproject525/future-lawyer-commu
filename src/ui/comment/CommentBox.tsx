'use client';

import React, { useState, useCallback, useRef, useMemo } from 'react';
import clsx from 'clsx';
import { IoIosArrowDown } from 'react-icons/io';
import { AxiosError } from 'axios';
import { IComment, ICommentParent, IPagingList, IRes } from '@/types';
import client from '@/services/client';
import Comment from '@/components/Comment/Comment';
import FlexBox from '@/components/Box/FlexBox';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { useMutation, useQuery } from '@tanstack/react-query';
import styles from '@/styles/contens.module.scss';
import { escapeMySQL } from '@/utils/mySqlUtils';
import Hr from '@/components/Hr/Hr';
import AppSessionContext from '../auth/AppSessionContext';

export type CommentBoxProps = {
  /**
   * 작성자 (익명 N)
   */
  title: string;
  isLast?: boolean;
} & Pick<
  ICommentParent,
  'seq' | 'regDt' | 'body' | 'replyCnt' | 'delYn' | 'userSeq' | 'contentsSeq'
>;

/**
 * TODO 본인 댓글 삭제/수정 기능
 */
const CommentBox = ({
  title,
  userSeq,
  regDt,
  body,
  replyCnt,
  seq,
  delYn,
  isLast,
  contentsSeq,
}: CommentBoxProps) => {
  const [replyBody, setReplyBody] = useState('');
  const [openReply, setOpenReply] = useState(false);
  const [openReplyForm, setOpenReplyForm] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputCallback = useCallback((ele: HTMLInputElement | null) => {
    ele?.focus();
    inputRef.current = ele;
  }, []);

  // 답글 조회
  const { data, refetch } = useQuery<IComment[], AxiosError>({
    initialData: [],
    _defaulted: false,
    queryKey: ['comment', 'reply', seq],
    queryFn: () =>
      client
        .get<IRes<IPagingList<IComment>>>(`/comment/reply/${seq}`)
        .then((res) => (res.data.header.success ? res.data.body.list : [])),
  });

  // 답글 등록
  const addReply = useMutation<
    IRes<boolean>,
    AxiosError,
    {
      body: string;
      token: string;
    }
  >({
    mutationKey: [contentsSeq],
    mutationFn: ({ body, token }) =>
      client
        .post(
          `/comment/${contentsSeq}`,
          {
            body: escapeMySQL(body),
            parentSeq: seq,
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => res.data),
    onSuccess: (res) => {
      if (res.header.success && res.body) {
        alert('답글을 등록하였습니다.');
        setReplyBody('');
        setOpenReplyForm(false);
        refetch().then(() => {
          setOpenReply(true);
        });
      }
    },
  });

  // 댓글+답글 수정
  const editComment = useMutation<
    IRes<boolean>,
    AxiosError,
    {
      body: string;
      token: string;
      seq: number;
    }
  >({
    mutationKey: [contentsSeq],
    mutationFn: ({ body, token, seq }) =>
      client
        .post(
          `/comment/${contentsSeq}/${seq}`,
          {
            body: escapeMySQL(body),
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => res.data),
    onSuccess: (res) => {
      if (res.header.success && res.body) {
        alert('수정하였습니다.');
        refetch().then(() => {
          setOpenReply(true);
        });
      }
    },
  });

  const cnt = useMemo(
    () => data.length || replyCnt || 0,
    [data.length, replyCnt],
  );

  return (
    <AppSessionContext.Consumer>
      {({ data: authData }) => (
        <Comment
          body={body}
          regDt={regDt.slice(0, 16)}
          title={title}
          onEdit={
            userSeq === authData?.user.seq
              ? (newBody) => {
                  if (authData?.user.accessToken) {
                    editComment.mutate({
                      body: newBody,
                      seq,
                      token: authData?.user.accessToken,
                    });
                  }
                }
              : undefined
          }
          onDelete={userSeq === authData?.user.seq ? () => {} : undefined}
        >
          <FlexBox
            className="mt-1"
            style={{
              columnGap: '0.5em',
            }}
          >
            <Button
              size="sm"
              variant="text"
              color="info"
              flexContents
              style={{
                gap: 2,
              }}
              onClick={() => {
                setOpenReply((b) => !b);
                refetch();
              }}
              disabled={cnt === 0}
            >
              답글 {cnt}개{' '}
              <IoIosArrowDown
                style={{
                  width: 14,
                  height: 14,
                }}
                className={clsx({
                  [styles.rotate_0]: !openReply,
                  [styles.rotate_180]: openReply,
                })}
              />
            </Button>
            {delYn === 'N' && (
              <Button
                size="sm"
                variant="text"
                onClick={() => {
                  setOpenReplyForm(true);
                  inputRef.current?.focus();
                }}
              >
                답글
              </Button>
            )}
            {openReplyForm && (
              <>
                <Button
                  size="sm"
                  variant="text"
                  onClick={() => setOpenReplyForm(false)}
                >
                  취소
                </Button>
                <Button
                  size="sm"
                  variant="text"
                  onClick={() => {
                    if (authData?.user.accessToken) {
                      addReply.mutate({
                        body: replyBody,
                        token: authData?.user.accessToken,
                      });
                    }
                  }}
                  color="success"
                >
                  저장
                </Button>
              </>
            )}
          </FlexBox>
          {openReplyForm && (
            <div className="mt-1">
              <Input
                ref={inputCallback}
                placeholder="답글 추가"
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
              />
            </div>
          )}
          {openReply && (
            <div data-desc={`comment-${seq}-reply`} className="mt-1 pl-2">
              {data.map((item, idx) => (
                <Comment
                  key={`reply-${item.seq}`}
                  title={`답글 ${idx + 1}`}
                  regDt={item.regDt}
                  body={item.body}
                  onEdit={
                    item.userSeq === authData?.user.seq ? () => {} : undefined
                  }
                  onDelete={
                    item.userSeq === authData?.user.seq ? () => {} : undefined
                  }
                />
              ))}
            </div>
          )}
          {!isLast && <Hr />}
        </Comment>
      )}
    </AppSessionContext.Consumer>
  );
};

export default CommentBox;
