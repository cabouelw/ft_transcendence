import classes from "../styles/Search.module.css";
import Image from "next/image";
import Union from "../public/FriendIcons/Union.svg";
import Friend from "../public/FriendIcons/FriendIcon.svg";
import Pending from "../public/FriendIcons/Pending.svg";
import AddFriend from "../public/FriendIcons/ADDFriend.svg";
import { motion } from "framer-motion";
import { requests } from "../customHooks/useFetchData";
import { NextRouter } from "next/router";
import { useRef, useState } from "react";
import { useOutsideAlerter } from "../customHooks/Functions";

export const FriendButton: React.FC<{
	login: string;
	router: NextRouter;
	refresh: () => void;
}> = (props) => {
	const handler = async () => {
		await requests(props.login, "friendship/unfriend", props.router);
		props.refresh();
	};
	return (
		<div className={classes.btnfriend} onClick={handler}>
			<div className={classes.Hover}>
				<Image src={Union} />
			</div>
			<span className={classes.AddBTNHover}>Unfriend</span>
			<div className={classes.notHover}>
				<Image src={Friend} />
			</div>
			<span className={classes.AddBTN}>Friend</span>
		</div>
	);
};

export const ADDButton: React.FC<{
	login: string;
	router: NextRouter;
	refresh: () => void;
}> = (props) => {
	const handler = async () => {
		await requests(props.login, "friendship/addFriend", props.router);
		props.refresh();
	};
	return (
		<div className={classes.btnFriendADD} onClick={handler}>
			<div className={classes.icon}>
				<Image src={AddFriend} />
			</div>
			<span className={classes.FriendADD}>Add Friend</span>
		</div>
	);
};

export const PendingButton: React.FC<{
	login: string;
	router: NextRouter;
	refresh: () => void;
}> = (props) => {
	const handler = async () => {
		await requests(props.login, "friendship/cancelRequest", props.router);
		props.refresh();
	};
	return (
		<div className={classes.btnPending} onClick={handler}>
			<div className={classes.PendingHover}>
				<Image src={Union} />
			</div>
			<span className={classes.PendingBTNHover}>Cancel</span>
			<div className={classes.PendingnotHover}>
				<Image src={Pending} />
			</div>
			<span className={classes.PendingBTN}>Pending</span>
		</div>
	);
};

export const RequestButton: React.FC<{
	login: string;
	router: NextRouter;
	refresh: () => void;
}> = (props) => {
	const ConfirmHandler = async () => {
		await requests(props.login, "friendship/acceptRequest", props.router);
		props.refresh();
	};
	const RefuseHandler = async () => {
		await requests(props.login, "friendship/refuseRequest", props.router);
		props.refresh();
	};
	const [drop, setDrop] = useState(false);
	const handler = () => setDrop((prev) => !prev);
	const btnRef = useRef(null);

	useOutsideAlerter(btnRef, setDrop);
	return (
		<div className={classes.btnRequest} onClick={handler} ref={btnRef}>
			<div className={classes.Request}>
				<Image src={Pending} />
			</div>
			<span className={classes.RequestBTN}>Request</span>
			{drop && (
				<OptionMenu
					firstClick={ConfirmHandler}
					FirstBtn="Confirm"
					SecondBtn="Refuse"
					SecondClick={RefuseHandler}
					width="9rem"
				/>
			)}
		</div>
	);
};

export const OptionMenu: React.FC<{
	FirstBtn: string;
	SecondBtn: string;
	width: string;
	firstClick: () => void;
	SecondClick: () => void;
}> = (props) => {
	return (
		<motion.div
			initial={{ scale: 0.5 }}
			animate={{ scale: 1 }}
			className={classes.optionMenu}
			style={{ width: `${props.width}` }}
		>
			<div className={classes.itemListoption} onClick={props.firstClick}>
				{props.FirstBtn}
			</div>
			<div
				className={classes.itemListoptionBlock}
				onClick={props.SecondClick}
			>
				{props.SecondBtn}
			</div>
		</motion.div>
	);
};
