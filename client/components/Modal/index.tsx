import Styles from "@styles/chat.module.css"
import Cross from "@public/Cross.svg"
import Image from "next/image"
import React, { Dispatch, FormEvent, SetStateAction, useContext, useState } from "react"
import { ChatContext, ChatContextType } from "@contexts/chatContext"
import { motion } from "framer-motion"
import Avatar from "@public/profile.jpg"
import { Option, SuggestedUsr, UsrTag, addUsrToChannel, removeUsrFromChannel, removeTag, filterUsers } from "./utils"
import { chatValidationSchema } from "validation/chatSchemas"

// Importing formik hooks
import { useFormik } from "formik";

const initialUsrState = [{ id: 0, imgSrc: Avatar, firstName: "Youness", lastName: "Santir", status: "Online" },
{ id: 1, imgSrc: Avatar, firstName: "Youness", lastName: "Crew", status: "In Game" },
{ id: 2, imgSrc: Avatar, firstName: "Ikram", lastName: "Kharbouch", status: "Offline" },];

interface chatFormValues {
    cName: string,
    password: string,
    members: Array<string>
}

export function ModalBox(props: { show: boolean, setShow: (Dispatch<SetStateAction<boolean>>), createChannel: any }): JSX.Element {

    const { protectedChannel, channelMode } = useContext(ChatContext) as ChatContextType;
    const [channelName, setChannelName] = useState("");
    const [password, setPassword] = useState("");
    const [showDrpdown, setshowDrpdown] = useState(false);
    const [usrTags, setUsrTags] = useState<Array<string>>([]);
    const [closeUsrs, setCloseUsrs] = useState(initialUsrState);

    // Set the form validation using Yup && formik
    const formik = useFormik({
        initialValues: {
            cName: "",
            password: "",
            member: ""
        },
        onSubmit: values => {
            console.log(values);
        },
    });

    const onSubmit = (values: chatFormValues) => {
        alert(JSON.stringify(values, null, 2));
    };

    const renderError = (message: string) => <p className={Styles.errorMsg}>{message}</p>;

    const handleOnChange = (event: any) => {
        let value = event.target.value;

        formik.setFieldValue("member", value);

        console.log(formik.values.member);

        // Filter values here
        filterUsers(value, setCloseUsrs, setshowDrpdown, initialUsrState);

    };

    return (
        <>
                {props.show && <><div style={{ display: props.show ? "block" : "none" }} className={Styles.grayBg}>&nbsp;</div>
                    <motion.div className={Styles.modalbox} animate={{ scale: 1 }} initial={{ scale: 0.5 }}>
                        <div>
                            <h1 className={Styles.createChnl}>Create channel</h1>
                            <div><Image src={Cross} width={10} height={10} onClick={() => props.setShow(!props.show)} /></div>
                        </div>
                        <form className={Styles.form}>
                            <div className={Styles.inputContainer}>
                                <span>Channel name</span>
                                <input name="cName" type="text" className={Styles.usrsInpt} />
                                {/* <ErrorMessage name="cName" render={() => renderError("Channel names should contain between 3 & 15 characters.")} /> */}
                            </div>
                            <div className={Styles.options}>
                                <Option type="Public" />
                                <Option type="Private" />
                                <Option type="Protected" />
                            </div>
                            {(channelMode === "Public") && <p>All users can find and join this channel</p>}
                            {(channelMode === "Private") && <p>Only users you invited can join the channel</p>}
                            {(channelMode === "Protected") && <p>All users can find the channel but only those with the provided password can join</p>}
                            {(protectedChannel && channelMode === "Protected") && <div className={Styles.inputContainer}>
                                <span>Password</span>
                                <input name="password" type="password" className={Styles.usrsInpt} />
                                {/* <ErrorMessage name="password" render={() => renderError("Passwords should contain between 8 & 15 characters.")} /> */}
                            </div>}
                            <div className={Styles.inputContainer + " " + Styles.mTop}>
                                <span>Add Members</span>
                                <div className={Styles.usrsInpt}>
                                    {usrTags.map((tag, i) => <UsrTag key={i} fullname={tag} removeTag={removeTag} id={i} usrTags={usrTags} setUsrTags={setUsrTags} />)}
                                    {(usrTags.length < 10) && <input name="member" type="text" onChange={handleOnChange} value={formik.values.member} />}
                                </div>
                                {showDrpdown && <div className={Styles.dropMembers}>
                                    {closeUsrs.map((usr, i) => <SuggestedUsr key={i} user={usr} userStatus={true} addUsrToChannel={addUsrToChannel} removeUsrFromChannel={removeUsrFromChannel} setUsrTags={setUsrTags} setshowDropdown={setshowDrpdown} usrTags={usrTags} setValue={formik.setFieldValue} />)}
                                </div>}
                            </div>
                            <button onClick={(e) => props.createChannel(channelName, password, usrTags.length)}>Create</button>
                        </form>
                    </motion.div>
                </>}
        </>)
}