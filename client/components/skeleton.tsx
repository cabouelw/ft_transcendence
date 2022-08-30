import React, { useState } from "react";
import Header from "./Header/Header";
import SideNav from "./Header/sideNav";
import classesNav from "../styles/sideNav.module.css";
import { useRouter } from "next/router";
import ProfileInfoEdit from "./profile/ProfileInfoEdit";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { Toggle, ToggleValue } from "./store/UI-Slice";
import Section from "./section";

const Skeleton = (props: { elm: any }) => {
	const ctn = useRouter();
	const NamePage = "/" + ctn.pathname.split("/")[1];
	const navBarHandler = (page: string) => {
		setPosIndicator(() => {
			if (page === "/profile") return classesNav.profilePos;
			if (page === "/live-games") return classesNav.liveGamePos;
			if (page === "/game") return classesNav.gamePos;
			if (page === "/chat") return classesNav.chatPos;
			return classesNav.hide;
		});
	};
	const [posIndicator, setPosIndicator] = useState(() => {
		if (NamePage === "/profile") return classesNav.profilePos;
		if (NamePage === "/live-games") return classesNav.liveGamePos;
		if (NamePage === "/game") return classesNav.gamePos;
		if (NamePage === "/chat") return classesNav.chatPos;
		return classesNav.hide;
	});

	const displayCard = useAppSelector(ToggleValue);
	const dispatch = useAppDispatch();
	const toggleHandler = () => dispatch(Toggle());
	return (
		<>
			<style global jsx>{`
				div#__next {
					height: 100%;
				}
			`}</style>
			{displayCard && <ProfileInfoEdit setTagle={toggleHandler} />}
			<Header setPos={navBarHandler} />
			<SideNav onNav={navBarHandler} currentPos={posIndicator} />
			<Section elm={props.elm} />
		</>
	);
};

export default Skeleton;