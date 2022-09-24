import { getCookie } from "cookies-next";
import { DetailedHTMLProps, Dispatch, EventHandler, ImgHTMLAttributes, SetStateAction, useEffect, useRef, useState } from "react";
import classes from "../../styles/Lobby.module.css";

import down from "../../public/Game/Down.svg";
import Cross from "../../public/FriendIcons/Cross.svg";
import Image from "next/image";
import GameLobby from "./GameLobby";
import Queue from "./Queue";
import socket_game from "../../config/socketGameConfig";
import RankStar from "../../public/Game/raking-stars.svg";
import Theme1 from "../../public/GameThemes/theme1.png";
import Theme2 from "../../public/GameThemes/theme2.png";
import Theme3 from "../../public/GameThemes/theme3.png";
import Classic from "../../public/Game/Classic.svg";
import MsgSlideUp from "../Settings/slideUpMsg";
import { fetchDATA } from "@hooks/useFetchData";
import { Router, useRouter } from "next/router";
import { FriendOnline } from "@Types/dataTypes";
import { getImageBySize } from "@hooks/Functions";


class PropsType extends FriendOnline {
	select: any;
}

const Friend: React.FC<PropsType> = (props) => {
	const selectHandler = () => {
		props.select(props);
	}
	const avatar = getImageBySize(props.avatar, 72);
	return (
		<>
			<div className={classes.Friend}>
				<div className={classes.avatar}>
					<img src={avatar} />
				</div>
				<div className={classes.Name}>{props.fullname}</div>
				<div className={classes.btnSelect} onClick={selectHandler} >Select</div>
			</div>
		</>
	);
};

export const FriendGameSetting: React.FC<{
	Hide: () => void;
	setGamePage: Dispatch<SetStateAction<boolean>>;
}> = (props) => {
	const router = useRouter();
	const [themeselected, setThemeselected] = useState('0');
	const [friendSelected, setFriendSelected] = useState<FriendOnline>(new FriendOnline());
	const [ListFriends, setListFriends] = useState<FriendOnline[]>([]);
	const [isOpen, setisOpen] = useState(false);
	const ref_input = useRef(null);
	const ClickHandler = () => setisOpen((v) => !v);
	const SearchHandler = () => {
		setisOpen(true);
		setFriendSelected(ref_input.current!.value);
	};
	const selectThemehandler = (e: object) =>{
		setThemeselected(e!.target!.alt as string);
		
	}
	const StartHandler = () => {
		// TODO go gamePage
		// props.setGamePage(true);
		props.Hide();
	};
	const ClicktoSerachHandler = (e: object) => {
		ref_input.current!.value = ''
		const emtyFriend = new FriendOnline();
		setFriendSelected(emtyFriend);
		setisOpen(true);
	}
	const FriendSelect = (friend: FriendOnline) => {
		setFriendSelected(friend);
		setisOpen(false);
	}
	const mapToFriends = (fr: FriendOnline) => {
		const name = ref_input.current!.value;
		const nameUser = fr.fullname;
		if (name.length && nameUser.toLocaleLowerCase().includes(name))
			return <Friend select={FriendSelect} key={fr.login} {...fr}/>
		else if (!name.length)
			return <Friend select={FriendSelect} key={fr.login} {...fr}/>
	}
	useEffect(() => {
		fetchDATA(setListFriends, router, 'game/onlineFriends');
	}, [])
	return (
		<div className={classes.BackGround}>
			<div className={classes.CardSetting}>
				<span>
					Game settings{" "}
					<span onClick={props.Hide}>
						<Image src={Cross} />
					</span>
				</span>
				<h2>Game Theme</h2>
				<p>Select a game theme you want to play on</p>
				<div className={classes.listTheme}>
					<div className={`${classes.Theme} ${themeselected === '0' && classes.selected}`}>
						<img src={Theme1.src} alt='0' onClick={selectThemehandler}/>
					</div>
					<div className={`${classes.Theme} ${themeselected === '1' && classes.selected}`}>
						<img src={Theme2.src} alt='1' onClick={selectThemehandler}/>
					</div>
					<div className={`${classes.Theme} ${themeselected === '2' && classes.selected}`}>
						<img src={Theme3.src} alt='2' onClick={selectThemehandler}/>
					</div>
				</div>
				<h2>Invite Friend</h2>
				<p>Choose a friend you want to play with</p>
				<div className={classes.selectContainer}>
					<div className={classes.select} >
						<input
							onClick={ClicktoSerachHandler}
							ref={ref_input}
							value={friendSelected?.fullname}
							onChange={SearchHandler}
							className={classes.selectedFriend}
						/>
						<div className={classes.icon} onClick={ClickHandler}>
							<Image src={down} />
						</div>
						{isOpen && (
							<div className={classes.ListFriend}>
								{ListFriends.length !== 0 && ListFriends.map(mapToFriends)
								}
							</div>
						)}
					</div>
					<div className={classes.Create} onClick={StartHandler}>
						Create
					</div>
				</div>
			</div>
		</div>
	);
};

const Lobby = () => {
	const [cardisOpen, setCardisOpen] = useState(false);
	const [GamePage, setGamePage] = useState(false);
	const [QueuePage, setQueuePage] = useState(false);
	const [ErrorMsg, setErrorMsg] = useState(false);
	const closeHandler = () => {
		setGamePage(false);
	};
	const ShowCardHandler = () => {
		setCardisOpen(true);
	};
	const HideCardHandler = () => setCardisOpen(false);
	const cancelHandler = (text: string) => {
		if (text === "error") {
			setErrorMsg(true);
			const id = setTimeout(() => {
				setErrorMsg(false);
				return () => {
					clearTimeout(id);
				}
			}, 3000);
		}
		setQueuePage(false);
	};
	const joinRankHandler = () => {
		setQueuePage(true);
	};
	useEffect(() => {
		socket_game.connect();
		return () => {
			// socket_game.disconnect();
		};
	}, []);
	return (
		<>
			{ErrorMsg && (
				<MsgSlideUp
					msg="in game already"
					colorCtn="#FF6482"
					colorMsg="#ECF5FF"
				/>
			)}
			{QueuePage && <Queue cancel={cancelHandler} />}
			{GamePage && !QueuePage && <GameLobby close={closeHandler} />}
			{!GamePage && !QueuePage && (
				<>
					{cardisOpen && (
						<FriendGameSetting
							Hide={HideCardHandler}
							setGamePage={setGamePage}
						/>
					)}
					<div className={classes.LobbyContainer}>
						<span>Game Lobby</span>
						<div className={classes.pingPongContainer}>
							<span>Pong Game</span>
							<p>
								Lorem ipsum dolor sit amet consectetur
								adipiscing elit Ut et massa mi. Aliquam in
								hendrerit urna. Pellentesque sit amet sapien
								fringilla, mattis ligula consectetur, ultrices
								mauris. Maecenas vitae mattis tellus. Nullam
								quis.
							</p>
						</div>
						<div className={classes.cardContainers}>
							<div className={classes.RankContainer}>
								<span>Ranked Game</span>
								<div className={classes.logoContainer}>
									<Image src={RankStar} />
								</div>
								<p>
									Lorem ipsum dolor sit amet consectetur
									adipiscing elit Ut et massa mi. Aliquam in
									Lorem ipsum dolor sit amet consectetur
									adipiscing elit Ut et massa. Lorem ipsum
									dolor sit amet consectetur adipiscing elit
									Ut et massa mi.
								</p>
								<div
									className={classes.JoinQueue}
									onClick={joinRankHandler}
								>
									Join Queue
								</div>
							</div>
							<div className={classes.RankContainer}>
								<span>Friend Game</span>
								<div className={classes.logoContainer}>
									<Image src={Classic} />
								</div>
								<p>
									Lorem ipsum dolor sit amet consectetur
									adipiscing elit Ut et massa mi. Lorem ipsum
									dolor sit amet consectetur adipiscing elit
									Ut et massa mi. Lorem ipsum dolor sit amet
									consectetur adipiscing elit Ut et massa mi.
								</p>
								<div
									className={classes.JoinQueue}
									onClick={ShowCardHandler}
								>
									Invite Friend
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default Lobby;
