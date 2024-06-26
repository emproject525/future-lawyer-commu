'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AxiosError } from 'axios';
import client from '@/services/client';
import { FaRegCommentAlt } from 'react-icons/fa';
import { RxReload } from 'react-icons/rx';
import { IoArrowUpOutline } from 'react-icons/io5';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { ICommentParent, IRes } from '@/types';
import FlexBox from '@/components/Box/FlexBox';
import Button from '@/components/Button/Button';
import Span from '@/components/Font/Span';
import CommentBox from './CommentBox';
import { escapeMySQL } from '@/utils/mySqlUtils';
import Spinner from '@/components/Icon/Spinner';
import AppSessionContext from '../auth/AppSessionContext';
import AuthWrapper from '../auth/AuthWrapper';
import Input from '@/components/Input/Input';

type CommentFormProps = {
  /**
   * 전체 댓글 수
   */
  totalCommentCnt: number;
};

type CommentList = {
  count: number;
  list: ICommentParent[];
  first: number;
};

const CommentForm: React.FC<CommentFormProps> = ({ totalCommentCnt }) => {
  const [body, setBody] = useState('');
  const { seq } = useParams();
  const [target, setTarget] = useState<ICommentParent[]>([]); // 렌더링 대상
  const [p, setP] = useState({ p: -1, n: -1 }); // 파라미터

  // 댓글 조회
  const { data, isFetching, refetch, isFetched } = useQuery<
    CommentList,
    AxiosError
  >({
    queryKey: ['comment', seq, p],
    initialData: {
      list: target,
      count: target.length,
      first: target[0]?.seq ?? -1,
    },
    _defaulted: true,
    queryFn: () =>
      client
        .get<IRes<CommentList>>(`/comment/${seq}?p=${p.p}&n=${p.n}`)
        .then((res) =>
          res.data.header.success
            ? {
                count: res.data.body.count,
                first: res.data.body.first,
                list: res.data.body.list.reverse(),
              }
            : {
                count: 0,
                first: 0,
                list: [],
              },
        ),
  });

  useEffect(() => {
    if (isFetched) {
      setTarget((b) => {
        const map = new Map(data.list.map((item) => [`${item.seq}`, item]));
        b.forEach((item) => {
          map.set(`${item.seq}`, item);
        });
        return Array.from(map.values()).sort((a, b) =>
          a.regDt < b.regDt ? -1 : a.regDt > b.regDt ? 1 : a.seq - b.seq,
        );
      });
    }
  }, [data.list, isFetched]);

  // 댓글 등록
  const { mutate, isPending } = useMutation<
    IRes<boolean>,
    AxiosError,
    {
      body: string;
      token: string;
    }
  >({
    mutationKey: [target],
    mutationFn: ({ body, token }) =>
      client
        .post(
          `/comment/${seq}`,
          { body: escapeMySQL(body) },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => res.data),
    onSuccess: (res) => {
      if (res.header.success) {
        setBody('');
        // setP({
        //   p: -1,
        //   n: target.slice(-1)?.[0]?.seq || -1,
        // });
        refetch();
      }
    },
  });

  const cnt = useMemo(
    () => data.count || totalCommentCnt || 0,
    [data.count, totalCommentCnt],
  );

  return (
    <AppSessionContext.Consumer>
      {({ data: authData }) => (
        <div data-desc="comment" id="comment">
          <FlexBox
            row
            style={{
              columnGap: '0.5em',
            }}
          >
            <FaRegCommentAlt />
            <Span>댓글</Span>
            <Span color="info">{cnt}</Span>
          </FlexBox>
          <div className="my-2">
            {(target[0]?.seq ?? -1) > data.first && (
              <Button
                block
                flexContents
                color="gray-200"
                onClick={() => setP({ p: data.list[0]!.seq, n: -1 })}
              >
                {isFetching ? <Spinner /> : <IoArrowUpOutline />}
                이전 댓글 확인
              </Button>
            )}
          </div>
          <div className="my-2">
            {target.map((commentItem, idx) => (
              <CommentBox
                key={`comment-${seq}-${commentItem.seq}`}
                title={`익명 ${cnt - (target.length - idx) + 1}`}
                isLast={target.length === idx + 1}
                {...commentItem}
              />
            ))}
          </div>
          <Button
            block
            flexContents
            onClick={() => {
              setP({
                p: -1,
                n: target.slice(-1)?.[0]?.seq || -1,
              });
              refetch();
            }}
            color="gray-200"
          >
            {isFetching ? <Spinner /> : <RxReload />}
            새로운 댓글 확인
          </Button>
          <AuthWrapper needLogin>
            <>
              <div className="my-2">
                <Input value={body} onChange={(e) => setBody(e.target.value)} />
              </div>
              <Button
                block
                flexContents
                onClick={() => {
                  if (authData?.user.accessToken) {
                    mutate({
                      body,
                      token: authData?.user.accessToken,
                    });
                  }
                }}
                disabled={isPending}
              >
                댓글 쓰기
                {isPending && <Spinner />}
              </Button>
            </>
          </AuthWrapper>
        </div>
      )}
    </AppSessionContext.Consumer>
  );
};

export default CommentForm;
