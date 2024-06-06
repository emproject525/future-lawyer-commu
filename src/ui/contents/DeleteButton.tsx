'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MdOutlineDelete } from 'react-icons/md';
import client from '@/services/client';
import Button from '@/components/Button/Button';
import { useMutation } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { IRes } from '@/types';
import AppSessionContext from '../auth/AppSessionContext';
import Spinner from '@/components/Icon/Spinner';

/**
 * 게시글 삭제 버튼
 * @returns
 */
const DeleteButton: React.FC<{
  seq: number;
}> = ({ seq }) => {
  const router = useRouter();
  const { mutate, isPending } = useMutation<
    AxiosResponse<IRes<boolean>>,
    AxiosError,
    {
      token: string;
    }
  >({
    mutationKey: [seq],
    mutationFn: ({ token }) =>
      client.delete(`/contents/${seq}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    onSuccess: (res) => {
      if (res.status === 200 && res.data.header.success) {
        router.push('/contents');
      }
    },
  });

  return (
    <AppSessionContext.Consumer>
      {({ data }) => (
        <Button
          flexContents
          variant="outlined"
          color="gray-200"
          disabled={isPending}
          onClick={() => {
            if (
              !!data?.user.accessToken &&
              confirm('게시글을 삭제하시겠습니까?')
            ) {
              mutate({ token: data?.user.accessToken });
            }
          }}
        >
          <MdOutlineDelete />
          삭제
          {isPending && <Spinner />}
        </Button>
      )}
    </AppSessionContext.Consumer>
  );
};

export default DeleteButton;
