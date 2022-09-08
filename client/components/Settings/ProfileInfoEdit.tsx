import classes from "../../styles/EditProfile.module.css";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import UploadIcon from "../../public/FriendIcons/UploadIcon.svg";
import CrossIcon from "../../public/FriendIcons/Cross.svg";
import { useAppDispatch } from "../store/hooks";
import { Toggle } from "../store/UI-Slice";
import { EmtyUser, UserTypeNew } from "../../Types/dataTypes";
import { motion } from "framer-motion";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { fetchUserInfo, updateUserInfo } from "../../customHooks/useFetchData";
import { getImageBySize, useOutsideAlerter } from "../../customHooks/Functions";

interface profileData {
	setTagle: (t: boolean) => void;
}

const OldData = {
	name: '',
	image: ''
}

const ProfileInfoEdit: React.FC<profileData> = (props) => {
	const nameRef = useRef<any>(null);
	const ImageRef = useRef<any>(null);
	const avatarRef = useRef<any>(null);
	const wrapperRef = useRef(null);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const token = getCookie("jwt");
	const [UserData, setUserData] = useState<UserTypeNew>(EmtyUser);
	const toggleHandler = async () => {
		await updateUserInfo(nameRef, ImageRef, OldData, token);
		dispatch(Toggle());
		router.push('/');
	};

	useEffect(() => {
		fetchUserInfo(OldData, token, router, setUserData);
		const avatar = avatarRef.current;
		const Image = ImageRef.current;
		Image!.addEventListener('change', () => {
			avatar!.src = URL.createObjectURL(Image!.files![0]);
		})
	}, []);

	useOutsideAlerter(wrapperRef, props.setTagle);
	const clickHandler = () => {
		props.setTagle(false);
	};
	const pathImage = getImageBySize(UserData?.avatar, 70);
	return (
		<motion.div
			className={classes.background}
			initial={{
				opacity: 0,
			}}
			animate={{
				opacity: 1,
			}}
		>
			<motion.div
				className={classes.popUpCtn}
				ref={wrapperRef}
				initial={{
					opacity: 0,
					scale: 0.1,
				}}
				animate={{
					opacity: 1,
					scale: 1,
				}}
			>
				<div className={classes.titlePopUp}>
					Edit Profile
					<motion.div
						onClick={clickHandler}
						className={classes.cross}
						animate="animate"
					>
						<Image src={CrossIcon} width="120%" height="120%" />
					</motion.div>
				</div>
				<div className={classes.avatar}>
					<img src={pathImage} ref={avatarRef} />
					<input
						type="file"
						className={`${classes.toggle} ${classes.inputHide}`}
						ref={ImageRef}
						accept='.png, .jpg, .jpeg'
					/>
					<div className={`${classes.toggle}`}>
						<Image src={UploadIcon} width="120%" height="120%" />
					</div>
				</div>
				<div className={classes.UserName}>Username :</div>
				<input
					className={classes.UserNameInput}
					type="text"
					defaultValue={UserData?.fullname}
					ref={nameRef}
				/>
				<div className={classes.btnSave} onClick={toggleHandler}>
					Update
				</div>
			</motion.div>
		</motion.div>
	);
};

export default ProfileInfoEdit;
