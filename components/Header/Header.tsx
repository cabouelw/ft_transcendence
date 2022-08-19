import React, { FormEventHandler, useEffect, useRef, useState } from "react";
import classes from "../../styles/Header.module.css";
import { Text } from "../../styles/styled-components";
import Image from "next/image";
import Search from "../../public/Icon.svg";
import Avatar from "../../public/profile.jpg";
import DownArrow from "../../public/Caret down.svg";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../store/hooks";

import { Toggle, ToggleValue } from "../store/UI-Slice";
import { useOutsideAlerter } from "../profile/ProfileInfoEdit";
import axios from "axios";
import { UserType } from "../../Types/dataTypes";
import { initialState as emtyUser } from "../store/userSlice";
import { motion } from "framer-motion";

interface DATA {
	image: any;
	name: string;
	ntf: boolean;
}

const UserSection = () => {
	const menu = useRef(null);
	const dispatch = useAppDispatch();
	const [dropDown, setDropDown] = useState(false);
	const [UserData, setUserData] = useState<UserType>(emtyUser);
	const ClickHandler = () => setDropDown(!dropDown);
	const toggleHandler = () => {
		dispatch(Toggle());
		ClickHandler();
	};
	useOutsideAlerter(menu, setDropDown);

	useEffect(() => {
		const fetchData = async () => {
			const data = await axios
				.get(
					`https://test-76ddc-default-rtdb.firebaseio.com/owner.json`
				)
				.then((res) => {
					setUserData(res.data);
				});
		};
		if (UserData?.fullName === "") fetchData();
	}, []);
	// console.log(route.pathname);
	
	return (
		<div className={classes.avatarContainer} onClick={ClickHandler}>
			<img src={UserData?.avatar} className={classes.avatar} />
			<Text className={classes.userName}>{UserData?.fullName}</Text>
			<Image src={DownArrow} width={24} height={24} />
			{dropDown && (
				<motion.div
					initial={{ scale: 0.5 }}
					animate={{ scale: 1 }}
					className={classes.DropDown}
					ref={menu}
				>
					<div className={classes.EditP} onClick={toggleHandler}>
						Edit profile
					</div>
					<div className={classes.LogOut}>Log out</div>
				</motion.div>
			)}
		</div>
	);
};

const Header: React.FC<{ setPos: (page: string) => void }> = (props) => {
	const input = useRef(null);
	const router = useRouter();
	if (router.pathname === '/')
		return <></>
	const searchHanler: FormEventHandler = (e) => {
		let current: any = input.current;
		e.preventDefault();
		props.setPos("hide");
		router.push({
			pathname: "/search",
			query: { search: `${current.value}` },
		});
	};
	useEffect(() => {
		let current: any = input.current;
		current.value = router.query.data ? router.query.data : "";
	}, [input]);
	// const route = useRouter();

	return (
		<div className={classes.topBar}>
			<div className={classes.tmpctn}>
				<div className={classes.inputContainer}>
					<Image src={Search} width={24} height={24} />
					<form
						className={classes.inputContainer}
						onSubmit={searchHanler}
					>
						<input
							ref={input}
							type="text"
							className={classes.searchInput}
							placeholder="Search"
						/>
					</form>
				</div>
				<UserSection />
			</div>
		</div>
	);
};

export default Header;
