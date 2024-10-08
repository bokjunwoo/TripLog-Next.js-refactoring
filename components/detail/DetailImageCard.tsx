import { IDetailInfo, IDetailLike } from '@/pages/api/api';
import { detailLike, detailUnlike } from '@/pages/api/detail';
import { userInfo } from '@/pages/api/sign';
import { Cursor } from '@/styles/styled';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import KakaoShare from '../kakao/KakaoShare';
import ToastMessage from '../toast/ToastMessage';

interface IDetailImageCardProps {
  detail: IDetailInfo;
  like: number;
  star: string;
  review: number;
  likeClickUser: '🤍' | '❤️';
  onButtonClick: () => void;
}

export default function DetailImageCard({
  detail,
  like,
  star,
  review,
  likeClickUser,
  onButtonClick,
}: IDetailImageCardProps) {
  const queryClient = useQueryClient();

  const router = useRouter();
  const { region, id } = router.query as { region: string; id: string };

  const [url, setUrl] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [clipboardClick, setClipboardClick] = useState(false);
  const [clipboardColor, setClipboardColor] = useState('');
  const [clipboardMessage, setClipboardMessage] = useState('');

  useEffect(() => {
    const currentUrl = window.location.href;
    setUrl(currentUrl);
  }, []);

  const handleClick = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setClipboardColor('primary');
        setClipboardMessage('URL이 클립보드에 복사되었습니다.');
        setClipboardClick(true);
      })
      .catch(() => {
        setClipboardColor('danger');
        setClipboardMessage('오류가 발생했습니다. 다시 한번 시도해 주세요.');
        setClipboardClick(true);
      });
  };

  const { data: user } = useQuery(['user'], userInfo);

  const mutationLike = useMutation(['fetchDetailLike', id], detailLike, {
    onMutate() {
      queryClient.setQueryData<IDetailLike>(['fetchDetailLike', id], (data) => {
        const newLike = data?.like || 0;
        const newLikeuser = data?.likeuser || [];

        const updateLike = newLike + 1;
        const updateLikeUser = [...newLikeuser, user];

        return {
          like: updateLike,
          likeuser: updateLikeUser,
        };
      });
    },

    onSuccess() {
      queryClient.refetchQueries(['fetchDetailLike']);
    },
  });

  const mutationUnlike = useMutation(['fetchDetailLike', id], detailUnlike, {
    onMutate() {
      queryClient.setQueryData<IDetailLike>(['fetchDetailLike', id], (data) => {
        const newLike = data?.like || 0;
        const newLikeuser = data?.likeuser || [];

        const updateLike = newLike - 1;
        const updateLikeUser = newLikeuser.filter((user) => user !== user);

        return {
          like: updateLike,
          likeuser: updateLikeUser,
        };
      });
    },

    onSuccess() {
      queryClient.refetchQueries(['fetchDetailLike']);
    },
  });

  const onSubmitLike = useCallback(() => {
    if (!user) {
      setIsLogin(true);
      return;
    }
    mutationLike.mutate({ id, region, user });
  }, [mutationLike, id, region, user]);

  const onSubmitUnlike = useCallback(() => {
    if (!user) {
      setIsLogin(true);
      return;
    }
    mutationUnlike.mutate({ id, region, user });
  }, [mutationUnlike, id, region, user]);

  return (
    <>
      <Card style={{ height: '500px' }}>
        <Card.Img
          variant="top"
          src={
            detail.firstimage1 === ''
              ? '/images/defaultImage.png'
              : detail.firstimage1
          }
          height="420px"
          className="fluid border"
        />
        <Card.Body className="d-flex justify-content-center align-items-center text-center pt-2 pb-2 fs-6">
          <div className="col-3">
            {likeClickUser === '🤍' ? (
              <Cursor onClick={onSubmitLike}>{likeClickUser}</Cursor>
            ) : (
              <Cursor onClick={onSubmitUnlike}>{likeClickUser}</Cursor>
            )}
            <div>{like}</div>
          </div>

          <div className="col-3">
            <Cursor onClick={onButtonClick}>⭐</Cursor>
            <div>{star}</div>
          </div>

          <div className="col-3">
            <KakaoShare detail={detail} like={like} review={review} />
            <div>카카오 공유</div>
          </div>

          <div className="col-3">
            <Cursor onClick={handleClick}>📎</Cursor>
            <div>URL 복사</div>
          </div>
        </Card.Body>
      </Card>

      <ToastMessage
        variant="danger"
        show={isLogin}
        setShow={setIsLogin}
        message="로그인이 필요한 기능입니다."
      />

      <ToastMessage
        variant={clipboardColor}
        show={clipboardClick}
        setShow={setClipboardClick}
        message={clipboardMessage}
      />
    </>
  );
}
