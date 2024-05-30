'use client';

import Backdrop from '@/components/Modal/Backdrop';
import Spinner from '@/components/Icon/Spinner';
import FlexBox from '@/components/Box/FlexBox';

const PageLoading = () => {
  return (
    <Backdrop>
      <FlexBox>
        <Spinner />
      </FlexBox>
    </Backdrop>
  );
};

export default PageLoading;
