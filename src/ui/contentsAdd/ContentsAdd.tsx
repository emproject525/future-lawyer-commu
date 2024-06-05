'use client';

import React, { useState, useEffect } from 'react';
import client from '@/services/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ICategory, IPagingList, IRes } from '@/types';
import FlexBox from '@/components/Box/FlexBox';
import ContentsEditor from '@/components/Editor/ContentsEditor';
import Button from '@/components/Button/Button';
import Input from '@/components/Input/Input';
import Select from '@/components/Input/Select';
import Spinner from '@/components/Icon/Spinner';
import { AxiosError, AxiosResponse } from 'axios';
import { escapeMySQL } from '@/utils/mySqlUtils';
import AppSessionContext from '../auth/AppSessionContext';

type ContentsAddProps = {
  editMode?: boolean;
  orgTitle?: string;
  orgBody?: string;
  orgCategorySeq?: number;
};

/**
 * app > contents > add > page
 * @returns
 */
const ContentsAdd: React.FC<ContentsAddProps> = ({
  editMode,
  orgBody,
  orgCategorySeq,
  orgTitle,
}) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<ICategory | undefined>();
  const router = useRouter();
  const { data: categories, isFetched } = useQuery<ICategory[]>({
    queryKey: ['category'],
    queryFn: () =>
      client
        .get<IRes<IPagingList<ICategory>>>(`http://localhost:3000/api/category`)
        .then((res) => {
          setCategory(res.data.body.list?.[0]);
          return res.data.body.list;
        }),
  });
  const { mutate, isPending } = useMutation<
    AxiosResponse<IRes<boolean>>,
    AxiosError,
    {
      title: string;
      body: string;
      categorySeq: number;
      token: string;
    }
  >({
    mutationFn: ({ title, body, categorySeq, token }) =>
      client.post(
        '/contents/add',
        {
          title,
          body,
          categorySeq,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    onSuccess: (res) => {
      if (res.status === 200 && res.data.header.success) {
        alert('게시글을 등록하였습니다.');
        router.push('/contents');
      } else {
        alert('작성 실패');
      }
    },
  });

  // 처리하지 않는 것으로. 입력한 값 그대로 저장, '만 values 입력 시 걸려서 걔만 replace
  // const escapeTitleHtml = (text: string) => {
  //   const map = {
  //     '&': '&amp;',
  //     '<': '&lt;',
  //     '>': '&gt;',
  //     '"': '&quot;',
  //     "'": '&#039;',
  //   };

  //   return text.replace(/[&<>"']/g, (m) => map[m as keyof typeof map]);
  // };

  useEffect(() => {
    if (editMode) {
      setTitle(orgTitle || '');
      setBody(orgBody || '');
      setCategory(categories?.find((i) => i.seq === orgCategorySeq));
    }
  }, [categories, editMode, orgBody, orgCategorySeq, orgTitle]);

  return (
    <AppSessionContext.Consumer>
      {({ data }) => {
        return (
          <FlexBox
            fullHeight
            column
            style={{
              rowGap: '1em',
            }}
          >
            <Input
              size="lg"
              id="title"
              name="title"
              placeholder="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 100))}
              onlyBorderBottom
            />
            <FlexBox
              alignItemsStart
              fullWidth
              style={{
                columnGap: '0.5em',
              }}
            >
              <Select<number>
                value={category?.main}
                onChange={(newValue) => {
                  setCategory(
                    categories?.find((i) => i.main === newValue && i.sub === 1),
                  );
                }}
                options={
                  categories
                    ?.filter((item) => item.sub === 1)
                    ?.map((item) => ({
                      label: item.mainName,
                      value: item.main,
                    })) || []
                }
              />
              {!!category && (
                <Select<number>
                  value={category?.sub}
                  onChange={(newValue) =>
                    setCategory((b) =>
                      categories?.find(
                        (i) => i.main === b?.main && i.sub === newValue,
                      ),
                    )
                  }
                  options={
                    categories
                      ?.filter((item) => item.main === category?.main)
                      ?.map((item) => ({
                        label: item.subName,
                        value: item.sub,
                      })) || []
                  }
                />
              )}
            </FlexBox>
            <ContentsEditor
              autoHeight
              value={body}
              onChange={(value) => setBody(value)}
            />
            <Button
              block
              flexContents
              color="success"
              disabled={isPending}
              onClick={() => {
                if (category && data?.user.accessToken) {
                  mutate({
                    title: escapeMySQL(title),
                    body: escapeMySQL(body),
                    categorySeq: category.seq,
                    token: data?.user.accessToken,
                  });
                }
              }}
            >
              게시글 {editMode ? '수정' : '등록'}
              {isPending && <Spinner />}
            </Button>
          </FlexBox>
        );
      }}
    </AppSessionContext.Consumer>
  );
};

export default ContentsAdd;
