import { AnyAction } from "@reduxjs/toolkit";
import { ShowErrorMsg } from "@store/UI-Slice";
import axios from "axios";
import { CookieValueTypes, getCookie } from "cookies-next";
import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";
import { baseUrl } from "../config/baseURL";
import socket_notif from "../config/socketNotif";
import { UserTypeNew } from "../Types/dataTypes";
import { eraseCookie } from "./Functions";

export const getQRcodeOrdisableCode = async (
	status: string,
	route: NextRouter
): Promise<string> => {
	const token = getCookie("jwt");
	const params = new URLSearchParams();
	params.append("is2faEnabled", status);
	return await axios({
		method: "post",
		url: `${baseUrl}auth/2faEnabling`,
		data: params,
		headers: {
			Authorization: `Bearer ${token}`,
		},
		withCredentials: true,
	})
		.then((res) => {
			return res.data;
		})
		.catch((err) => {
			if (err.response.status === 401) {
				eraseCookie("jwt");
				socket_notif.disconnect();
				route.replace("/");
			}
		});
};

export const Is2FAEnaled = (set: any, setP: any, route: NextRouter) => {
	const token = getCookie("jwt");
	axios
		.get(`${baseUrl}auth/is2faEnabled`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		})
		.then((result) => {
			set(result.data);
			setP(result.data);
		})
		.catch((err) => {
			if (err.response.status === 401) {
				eraseCookie("jwt");
				socket_notif.disconnect();
				route.replace("/");
			}
		});
};

export const check2FACode = async (
	code: string,
	route: NextRouter
): Promise<boolean> => {
	const token = getCookie("jwt");
	const params = new URLSearchParams();
	params.append("code", code);
	return await axios({
		method: "post",
		url: `${baseUrl}auth/2faValidate`,
		data: params,
		headers: {
			Authorization: `Bearer ${token}`,
		},
		withCredentials: true,
	})
		.then(() => {
			return true;
		})
		.catch((err) => {
			if (err.response.status === 401) {
				eraseCookie("jwt");
				socket_notif.disconnect();
				route.replace("/");
			}
			return false;
		});
};

export const LogOut = (route: NextRouter) => {
	const token = getCookie("jwt");
	axios
		.get(`${baseUrl}auth/logout`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		})
		.then(() => {
			socket_notif.disconnect();
			route.replace("/");
		})
		.catch((err) => {
			eraseCookie("jwt");
			socket_notif.disconnect();
			route.replace("/");
		});
};

export const updateUserInfo = async (
	nameRef: React.MutableRefObject<any>,
	ImageRef: React.MutableRefObject<any>,
	OldData: { name: string; image: string },
	token: CookieValueTypes
) => {
	const params = new FormData();
	const currentName = nameRef.current;
	const currentImage = ImageRef.current;
	const Name: string = currentName!.value;
	const Image = currentImage!.files;
	if (OldData.name !== Name)
		params.append("fullname", nameRef.current!.value);
	if (Image.length === 1) {
		params.append("avatar", Image![0]);
		params.append("oldPath", OldData.image);
	}
	await axios
		.post(`${baseUrl}user/editProfile`, params, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		})
		.catch((err) => {
			if (err.response.status === 401) {
				eraseCookie("jwt");
				socket_notif.disconnect();
			}
		});
};

export const fetchUserInfo = async (
	OldData: { name: string; image: string },
	token: CookieValueTypes,
	router: NextRouter,
	setUserData: React.Dispatch<React.SetStateAction<UserTypeNew>>
) => {
	await axios
		.get(`${baseUrl}user/header`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		})
		.then((res) => {
			OldData.name = res.data.fullname;
			OldData.image = res.data.avatar;
			setUserData(res.data);
		})
		.catch((err) => {
			if (err.response.status === 401) {
				eraseCookie("jwt");
				socket_notif.disconnect();
				router.replace("/");
			}
		});
};

export const fetchAchievements = async (
	setAchievementsids: React.Dispatch<React.SetStateAction<number[]>>,
	router: NextRouter,
	login: string
) => {
	const token = getCookie("jwt");
	let Id: string = "";
	if (login) Id = "/" + login;
	await axios
		.get(`${baseUrl}user/achievements${Id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		})
		.then((res) => {
			setAchievementsids(res.data.achievements);
		})
		.catch((err) => {
			if (err.response.status === 401) {
				eraseCookie("jwt");
				socket_notif.disconnect();
				router.replace("/");
			}
		});
};

export const fetchDATA = async (set: any, router: NextRouter, Path: string) => {
	const token = getCookie("jwt");
	await axios
		.get(`${baseUrl}${Path}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		})
		.then((res) => {
			set(res.data);
		})
		.catch((err) => {
			if (err.response.status === 401) {
				eraseCookie("jwt");
				socket_notif.disconnect();
				router.replace("/");
			}
		});
};

export const checkCode2FA = async (code: string, router: NextRouter) => {
	const token = getCookie("jwt-2fa");
	const params = new URLSearchParams();
	params.append("code", code);
	return await axios({
		method: "post",
		url: `${baseUrl}auth/2faLogin`,
		data: params,
		headers: {
			Authorization: `Bearer ${token}`,
		},
		withCredentials: true,
	})
		.then((res) => {
			return true;
		})
		.catch((err) => {
			if (err.response.status === 401) {
				eraseCookie("jwt-2fa");
				socket_notif.disconnect();
				router.replace("/");
			}
			return false;
		});
};

export const check2FA_JWT = async (
	jwt: CookieValueTypes,
	set: any,
	router: NextRouter
) => {
	await axios({
		method: "get",
		url: `${baseUrl}auth/is2faAuthorized`,
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
		withCredentials: true,
	})
		.then(() => {
			set(true);
		})
		.catch((err) => {
			if (err.response.status === 401) {
				eraseCookie("jwt");
				socket_notif.disconnect();
				router.replace("/");
				set(false);
			}
		});
};

export const checkJWT = async (
	router: NextRouter,
	set: Dispatch<SetStateAction<boolean>>
) => {
	const token = getCookie("jwt");
	await axios({
		method: "get",
		url: `${baseUrl}auth/isAuthorized`,
		headers: {
			Authorization: `Bearer ${token}`,
		},
		withCredentials: true,
	})
		.then(() => {
			router.push("/profile");
			eraseCookie("jwt-2fa");
		})
		.catch((err) => {
			if (err.response.status === 401) {
				eraseCookie("jwt");
				socket_notif.disconnect();
				router.replace("/");
				set(false);
			}
		});
};

export const requests = async (
	login: string,
	path: string,
	router: NextRouter
) => {
	const token = getCookie("jwt");
	const params = new URLSearchParams();
	params.append("login", login);
	return await axios({
		method: "post",
		url: `${baseUrl}${path}`,
		data: params,
		headers: {
			Authorization: `Bearer ${token}`,
		},
		withCredentials: true,
	})
		.then((res) => {
			return true;
		})
		.catch((err) => {
			if (err.response.status === 401) {
				eraseCookie("jwt");
				socket_notif.disconnect();
				router.replace("/");
			}
			return false;
		});
};

export const requestsChannel = async (
	convId: string,
	path: string,
	router: NextRouter
) => {
	const token = getCookie("jwt");
	const params = new URLSearchParams();
	params.append("convId", convId);
	return await axios({
		method: "post",
		url: `${baseUrl}${path}`,
		data: params,
		headers: {
			Authorization: `Bearer ${token}`,
		},
		withCredentials: true,
	})
		.then((res) => {
			return true;
		})
		.catch((err) => {
			if (err.response.status === 401) {
				eraseCookie("jwt");
				socket_notif.disconnect();
				router.replace("/");
			}
			return false;
		});
};

export const userExists = async (set: any, login: string, router: NextRouter, dispatch: Dispatch<AnyAction>) => {
	const token = getCookie("jwt");
	const params = new URLSearchParams();
	params.append("login", login);
	const res = await axios({
		method: "post",
		url: `${baseUrl}user/isExist`,
		data: params,
		headers: {
			Authorization: `Bearer ${token}`,
		},
		withCredentials: true,
	})
		.then((data) => {
			set(login);
		})
		.catch((err) => {
			if (err.response.status === 401) {
				eraseCookie("jwt");
				socket_notif.disconnect();
				router.replace("/");
			}
			dispatch(ShowErrorMsg());
			router.push('/profile');
		});
	return res;
};
