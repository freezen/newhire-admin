import axios from 'axios';
import React, { ChangeEvent, PropsWithChildren, useEffect, useState } from 'react';
import { ICredentials, setCredentials } from '../../utils/login';
import { post, reqConfig } from '../../utils/request';
import { useNavigate } from 'react-router-dom';
import './index.scss';
import toast, { Toaster } from 'react-hot-toast';

type Props = PropsWithChildren<{
    setHookCredentials: (val: ICredentials) => void;
}>;

export const Login: React.FC<Props> = ({setHookCredentials}) => {
  let username = '';
  let pwd = '';
  let navigator = useNavigate();
  const styles = {
    logo: {
        marginTop: '100px',
        marginBottom: '100px',
    },
    title: {
        fontFamily: 'Ping Fang SC, SimHei',
        fontWeight: 'bold',
        fontSize: '30px',
        color: '#888',
    },
    login: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#fff',
        height: '100%',
        cursor: 'pointer',
    },
    btnRow: {
        borderColor: '#065fd4',
        borderWidth: '1px',
        borderRadius: '4px',
        backgroundColor: '#065fd4',
        width: '220px',
        height: '40px',
    },
  };

  const clickLogin = () => {
    login(username, pwd);
  };

  const login = async (name: string, pwd: string) => {
    try {
      const res = await post('/login', {
        name,
        pwd,
      });
      const data = res?.data ?? {};
      if (data.success === true) {
        setCredentials(name, data.token, data.auth, data.id);
        setHookCredentials({
            key: name,
            token: data.token,
            auth: data.auth, 
            id: data.id,
        })
        // push
        navigator('/');
      } else {
        toast('Login failed.');
      }
    } catch (error) {
      console.error(error);
      alert('Login failed.');
    }
  };

  const usernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    username = e.target.value;
  };

  const pwdChange = (e: ChangeEvent<HTMLInputElement>) => {
    pwd = e.target.value;
  };

  return (
    <div className='loginMain'>
      <div style={styles.logo}>
        <span style={styles.title}>ABC Training Insight</span>
      </div>
      <div className='panel'>
        <div className='row'>
          <input onChange={usernameChange} placeholder="Username" />
        </div>
        <div className='row'>
          <input
            type="password"
            onChange={pwdChange}
            placeholder="Password"
          />
        </div>
        <div className='row' style={{...styles.btnRow}} onClick={clickLogin}>
          <div style={styles.login}>
            Login
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}