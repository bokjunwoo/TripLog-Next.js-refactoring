import Link from 'next/link';
import React, { useCallback, useRef, useState } from 'react';
import LocalButton from '@/components/common/LocalButton';
import { Card, Badge, Col, Form } from 'react-bootstrap';
import Head from 'next/head';
import {
  emailValidation,
  nicknameValidation,
  passwordReinspection,
  passwordValidation,
  ValidationResult,
} from '@/utils/sign';
import useSignInput from '@/components/hooks/useSignInput';
import { localRegister } from './api/sign';
import SignSuccess from '@/components/modal/SignSuccess';
import { ISignupResult } from './api/api';

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const repasswordInputRef = useRef<HTMLInputElement>(null);
  const nicknameInputRef = useRef<HTMLInputElement>(null);

  const [signupResult, setSignupResult] = useState<ISignupResult>({
    type: 'signup',
    success: false,
    message: '',
  });

  const [email, onChangeEmail, emailResult] = useSignInput('', emailValidation);
  const [nickname, onChangeNickname, nicknameResult] = useSignInput(
    '',
    nicknameValidation,
  );

  const [password, onChangePassword, passwordResult] = useSignInput(
    '',
    passwordValidation,
  );
  const [repassword, setRepassword] = useState<string>('');
  const [repasswordResult, setRepasswordResult] = useState<ValidationResult>({
    message: '',
    success: false,
  });
  const onChangePasswordCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRepassword(e.target.value);
      setRepasswordResult(passwordReinspection(password, e.target.value));
    },
    [password],
  );

  const onSubmitForm = useCallback(async () => {
    if (emailResult.success === false) {
      if (emailInputRef.current !== null) {
        emailInputRef.current.focus();
      }
      return;
    }
    if (passwordResult.success === false) {
      if (passwordInputRef.current !== null) {
        passwordInputRef.current.focus();
      }
      return;
    }
    if (repasswordResult.success === false) {
      if (repasswordInputRef.current !== null) {
        repasswordInputRef.current.focus();
      }
      return;
    }
    if (nicknameResult.success === false) {
      if (nicknameInputRef.current !== null) {
        nicknameInputRef.current.focus();
      }
      return;
    }
    setLoading(true);

    const response: ISignupResult = await localRegister(
      email,
      password,
      nickname,
    );

    setLoading(false);
    setSignupResult(response);
    setShow(response.success);
  }, [
    emailResult,
    passwordResult,
    repasswordResult,
    nicknameResult,
    email,
    nickname,
    password,
  ]);

  return (
    <>
      <Head>
        <title>트립로그 - 회원가입</title>
      </Head>

      <Col className="col-sm-10 col-md-8 col-lg-6 col-xl-6 m-auto mt-5 mb-5">
        <Card className="p-5">
          <div className="d-flex mb-5">
            <h4>TripLog</h4>
            <Link href="/login">
              <Badge
                bg="secondary"
                text="light"
                className="ms-2 p-1"
                style={{ fontSize: '.3rem' }}
              >
                이미 회원이라면?
              </Badge>
            </Link>
          </div>

          <Form onSubmit={onSubmitForm}>
            <Form.Group controlId="email">
              <Form.Label>아이디</Form.Label>
              <Form.Control
                type="text"
                placeholder="아이디를 입력해주세요"
                className="p-3"
                ref={emailInputRef}
                value={email}
                onChange={onChangeEmail}
                autoComplete="current-email"
              />
              <Form.Text
                className={`${
                  emailResult.success ? 'text-success' : 'text-danger'
                } m-1`}
              >
                {emailResult.message}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                placeholder="비밀번호를 입력해주세요"
                className="p-3"
                ref={passwordInputRef}
                value={password}
                onChange={onChangePassword}
                autoComplete="current-password"
              />
              <Form.Text
                className={`${
                  passwordResult.success ? 'text-success' : 'text-danger'
                } m-1`}
              >
                {passwordResult.message}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="repassword">
              <Form.Label>비밀번호 재확인</Form.Label>
              <Form.Control
                type="password"
                placeholder="비밀번호를 입력해주세요"
                className="p-3"
                ref={repasswordInputRef}
                value={repassword}
                onChange={onChangePasswordCheck}
                autoComplete="current-password"
              />
              <Form.Text
                className={`${
                  repasswordResult.success ? 'text-success' : 'text-danger'
                } m-1`}
              >
                {repasswordResult.message}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="ninkname">
              <Form.Label>닉네임</Form.Label>
              <Form.Control
                type="text"
                placeholder="닉네임을 입력해주세요"
                className="p-3"
                ref={nicknameInputRef}
                value={nickname}
                onChange={onChangeNickname}
              />
              <Form.Text
                className={`${
                  nicknameResult.success ? 'text-success' : 'text-danger'
                } m-1`}
              >
                {nicknameResult.message}
              </Form.Text>

              <LocalButton
                text="가입하기"
                onSubmitForm={onSubmitForm}
                loading={loading}
              />
            </Form.Group>
          </Form>
        </Card>
      </Col>

      <SignSuccess show={show} setShow={setShow} result={signupResult} />
    </>
  );
}
