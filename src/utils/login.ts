let token = '';
let key = '';
let auth = '';
let id = -1;
let expireTime = -1;

export interface ICredentials{
  token: string;
  key: string;
  auth: string;
  id: string;
  expireTime: number;
}

export const clearLogin = () => {
  token = '';
  key = '';
  auth = '';
  id = -1;
  expireTime = -1;
  window.localStorage.setItem("credentials", "{}");
};

export const setCredentials = (
  pKey: string,
  pToken: string,
  pAuth: string,
  pId: number,
  pExpireTime: number,
) => {
  token = pToken;
  key = pKey;
  auth = pAuth;
  id = pId;
  expireTime = pExpireTime;
  window.localStorage.setItem("credentials", JSON.stringify({
    token,
    key,
    auth,
    id,
    expireTime,
  }))
};

export const getCredentials = () => {
  if(!token){
    try {
      const credentials = JSON.parse(window.localStorage.getItem("credentials") ?? "{}");
      if(credentials.token){
        token = credentials.token;
        key = credentials.key;
        auth = credentials.auth;
        id = credentials.id;
        expireTime = credentials.expireTime;
      }
    } catch (e){
      console.error('Local storage error: ', e)
    }
  }
  if(!token || Date.now() > expireTime){
    clearLogin();
  }

  return {
    token,
    key,
    auth,
    id,
    expireTime,
  };
};
