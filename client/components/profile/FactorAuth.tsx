import classes from "../../styles/factorAuth.module.css"
import CrossIcon from "../../public/FriendIcons/Cross.svg"
import Image from "next/image"
import { useEffect, useState } from "react"
import LoadingElm from "../loading/Loading_elm"
import { check2FA_JWT, checkCode2FA } from "../../customHooks/useFetchData"
import { useRouter } from "next/router"
import { getCookie } from "cookies-next"
import { eraseCookie } from "../../customHooks/Functions"
import OtpInput from "react-otp-input-rc-17"

const FactorAuth = () => {
	const router = useRouter()
	const jwt = getCookie("jwt-2fa")
	if (!jwt) {
		router.push("/")
		return <LoadingElm />
	}
	const [isValid, setisValid] = useState(false)
	const [inputValue, setInputValue] = useState("")
	const [isError, setisError] = useState(false)
	useEffect(() => {
		if (jwt) check2FA_JWT(jwt, setisValid, router)
	}, [])
	if (!isValid) return <LoadingElm />
	const CheckHandler = async () => {
		if (await checkCode2FA(inputValue, router)) setisError(false)
		else setisError(true)
	}
	const sub = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (inputValue.length === 6)
			CheckHandler();
	}
	return (
		<>
			<div className={classes.background}>
				<div className={classes.FAuthContainer}>
					<div className={classes.header}>
						<span>2 Factor Authentication</span>
						<div
							className={classes.cross}
							onClick={() => {
								eraseCookie("jwt-2fa")
								router.replace("/")
							}}>
							<Image src={CrossIcon} width="72" height="72" />
						</div>
					</div>
					<div className={classes.inputContainer}>
					<form onSubmit={sub}>
						<OtpInput
							value={inputValue}
							numInputs={6}
							inputStyle={{
								width: "3rem",
								height: "3rem",
								margin: "0 .5rem",
								fontSize: "1.5rem",
								borderRadius: 4,
								border: `1px solid ${isError ? "red" : "black"}`,
							}}
							onChange={(e: any) => {
								setInputValue(e)
							}}
							shouldAutoFocus={true}
							isInputNum={true}
						/>
						<button style={{display: 'none'}}/>
						</form>
					</div>
					<div
						className={`${classes.btn} ${inputValue.length === 6 ? classes.btnNext : ""}`}
						onClick={CheckHandler}>
						Confirmer
					</div>
				</div>
			</div>
		</>
	)
}

export default FactorAuth
