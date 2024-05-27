'use client';

import React, { PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { IoClose } from 'react-icons/io5';
import Span from '../Font/Span';
import styles from '@/styles/modal.module.scss';
import Backdrop from './Backdrop';

export type ModalProps = {
  title?: string;
  bodyClassName?: string;
  headerClassName?: string;
};

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({
  children,
  title,
  bodyClassName,
  headerClassName,
}) => {
  const router = useRouter();

  // const preventScroll = () => {
  //   const currentScrollY = window.scrollY;
  //   document.body.style.position = 'fixed';
  //   document.body.style.width = '100%';
  //   document.body.style.top = `-${currentScrollY}px`; // 현재 스크롤 위치
  //   document.body.style.overflowY = 'scroll';
  //   return currentScrollY;
  // };

  // const allowScroll = (prevScrollY: number) => {
  //   document.body.style.position = '';
  //   document.body.style.width = '';
  //   document.body.style.top = '';
  //   document.body.style.overflowY = '';
  //   window.scrollTo(0, prevScrollY);
  // };

  // React.useEffect(() => {
  //   const prevScrollY = preventScroll();
  //   return () => {
  //     allowScroll(prevScrollY);
  //   };
  // }, []);

  return (
    <Backdrop>
      <div className={styles.modal}>
        <div
          className={clsx(styles.modal_header, headerClassName)}
          data-desc="modal-header"
        >
          <Span
            color="primary"
            style={{
              fontWeight: 'bold',
            }}
          >
            {title || ''}
          </Span>
          <button onClick={() => router.back()}>
            <IoClose />
          </button>
        </div>
        <div
          className={clsx(styles.modal_body, bodyClassName)}
          data-desc="modal-body"
        >
          {children}
        </div>
      </div>
    </Backdrop>
  );
};

export default Modal;
