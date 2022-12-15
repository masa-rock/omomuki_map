import client from "./client"
import Cookies from "js-cookie"

export const signUp = (params) => {
  return client.post("auth", params, {
    withCredentials: true
  })
}

export const signIn = (params) => {
  return client.post("auth/sign_in", params, {
    withCredentials: true
  })
}

// サインアウト
export const signOut = () => {
  return client.delete("auth/sign_out", {
    headers: {
      "access-token": Cookies.get("_access_token"),
      "client": Cookies.get("_client"),
      "uid": Cookies.get("_uid"),
    }
  })
}

// プロフィール編集
export const editProfile = () =>{
  return client.get("auth/edit");
}

// プロフィール更新
export const updateProfile = () =>{
  return client.patch("auth");
}

// パスワード変更
export const updatePassword = (params) =>{
  return client.put("auth/password", params, {
    headers: {
      "access-token": Cookies.get("_access_token"),
      "client": Cookies.get("_client"),
      "uid": Cookies.get("_uid"),
    }
  })
}

// ログインユーザーの取得
export const getCurrentUser = () => {
  if (
    !Cookies.get("_access_token") ||
    !Cookies.get("_client") ||
    !Cookies.get("_uid")
  ) return

  return client.get("/auth/sessions", {
    headers: {
      "access-token": Cookies.get("_access_token"),
      "client": Cookies.get("_client"),
      "uid": Cookies.get("_uid"),
    }
  },
  { withCredentials: true })
}
