import Styles from "@styles/chat.module.css"
import addUser from "@public/add-user.svg"
import Image from "next/image"
import Avatar from "@public/profile.jpg"
import { ModalBox } from "@components/Modal";
import { GameIconAsset, ChannelAsset, BlueChannelAsset, MenuAsset, BackArrow } from "../../svg/index"
import Search from "@public/Icon.svg";
import { setMsg, setChatUser, showProfile, sendInvite, filterChatUsers } from "@utils/chat";
import sendArrow from "@public/send-arrow.svg";
import arrowBack from "@public/arrow-back.svg";
import { chatUser } from "@Types/dataTypes";
import { ChatContext, ChatContextType } from "@contexts/chatContext";
import { useContext, useState, useRef, useEffect } from "react";
import { scrollToBottom } from "@utils/chat";
import { SettingsModal } from "@components/SettingsModal";
import { MembersModal } from "@components/MembersModal";
import Link from 'next/link'
import socket_notif from "config/socketNotif";
import { useRouter } from 'next/router'
import { getCookie } from "cookies-next";
import { postChannel } from "@hooks/useFetchData";
import { fetchDATA } from "@hooks/useFetchData";


const Members = (props: { role: string, users: Array<Object> }) => {

    const [dropdwn, setdropdwn] = useState(false);

    const setRefs: any = useRef([]);
    const MenuElement = () => {
        return (<MenuDropdown content={["Dismiss Admin", "Remove Member"]} functions={[() => console.log("test"), () => console.log("test")]} />)
    }

    // {dropdwn && menus.map((Element:any, i:any) => <div key={i} ref={element => setRefs.current[i] = element}><Element /></div>)}

    return (<div className={Styles.members}>
        {props.role}
        {props.users.map((user: any, i: number) => (<div key={i}>
            <div className={Styles.membersAvtr}>
                <Image src={user.avatar} width={40} height={40} />
                <span>{user.name}</span>
            </div>
            <div onClick={() => setdropdwn(!dropdwn)}>
                <MenuAsset />
                <div style={{ display: dropdwn ? "block" : "none" }} ref={element => setRefs.current[i] = element}><MenuElement /></div>
            </div>
        </div>))}
    </div>)
}

const Header = (props: { setShowSetModal: any }) => {
    return (<div className={Styles.profileHeader}>
        <h1>Channel Profile</h1>
        <button onClick={() => props.setShowSetModal(true)}><Image src={addUser} width={18} height={18} />Add Member</button>
    </div>)
}

export const Profile = (props: { setShowSetModal: any }) => {

    const owners = [{ name: "Ikram Kharbouch", avatar: Avatar }];
    const admins = [{ name: "Youness Bouddou", avatar: Avatar }, { name: "Youness Bouddou", avatar: Avatar }]
    const members = [{ name: "Youness Bouddou", avatar: Avatar }, { name: "Youness Bouddou", avatar: Avatar }, { name: "choaib abouelwafa", avatar: Avatar }, { name: "nounou lhilwa", avatar: Avatar }];

    return (<>
        <Header setShowSetModal={props.setShowSetModal} />
        <Members role="Owner" users={owners} key="Owner" />
        <Members role="Admins" users={admins} key="Admins" />
        <Members role="Members" users={members} key="Members" />
    </>)
}

export const ChatLeft = (props: { login: any }) => {

    // Setting some local state
    const { lastUsers, setShowCnv, showCnv, setLastUsers, chatUsersRefs, initialusrData } = useContext(ChatContext) as ChatContextType;
    const [show, setShow] = useState<boolean>(false);
    const [displayBlueIcon, setDisplayBlueIcon] = useState(false);

    const [channelDetails, setChannelDetails] = useState<any>();

    const router = useRouter();

    // functions
    async function createChannel(channelName: string, convType: string, password: string, members: Array<string>, setUsrTags: any, formik: any) {

        setShow(!show);

        let loginList = lastUsers.filter((item, i) => item.name == members[i]).map((item) => item.login);
        const data = {name: channelName, type: convType, members: loginList, password: password};

        // send data to channel create route here

        postChannel(setChannelDetails ,router, data)
        
        // reset the users here
        // setLastUsers([channelDetails, ...lastUsers]);

        // select the current chat
        // setChatUser(lastUsers[0], setShowCnv);

        // reset the necessary fields
        formik.setFieldValue("cName", "");
        formik.setFieldValue("password", "");
        formik.setFieldValue("member", "");
        setUsrTags([]);
    }

    useEffect(() => {

        console.log(props.login)
        if (props.login != undefined)
            setShowCnv(true);
    }, [])

    return (<>
        <div className={`${Styles.chatLeft} ${showCnv ? Styles.hideUsers : ""}`}>
            <div className={Styles.leftContent}>
                <div className={Styles.topSection}>
                    <div className={Styles.msg}>Message</div>
                    {!displayBlueIcon && <div onClick={() => setShow(!show)} className={Styles.channel} onMouseOver={() => setDisplayBlueIcon(true)}><ChannelAsset color="#758293" /></div>}
                    {displayBlueIcon && <div onMouseLeave={() => setDisplayBlueIcon(false)} className={Styles.channel} onClick={() => setShow(!show)}><BlueChannelAsset /></div>}
                    <ModalBox show={show} setShow={setShow} createChannel={createChannel} />
                </div>
                <div className={Styles.chatSearch}>
                    <Image src={Search} width={20} height={20} />
                    <input type="Text" className={Styles.chatInput} placeholder="Search" onChange={(e) => filterChatUsers(e, lastUsers, setLastUsers, initialusrData)} />
                </div>
                <div className={Styles.bottomSection}>
                    {lastUsers.map((user: any, i: any) => <Link href={"/chat?login=" + user.login} key={i}><div key={i} ref={(element) => { chatUsersRefs.current[parseInt(i)] = element }} className={Styles.chatUser}>
                        <div className={Styles.avatarName}>
                            <img src={user.avatar} className={Styles.avatar} />
                            <div className={Styles.username}>{user.name} {user.channelname}</div>
                        </div>
                        <p className={Styles.status}>{user?.status ? user.status : user?.membersNum + " members"}</p>
                    </div></Link>)}
                    {(lastUsers.length == 0) && <div className={Styles.newCnv}>No conversations yet</div>}
                </div>
            </div>
        </div>
    </>)
}

export const ChatRight = (props: { setShowSetModal: any, login: number }) => {

    const { showCnv, setShowCnv, messagesEndRef, chatMsgs, setChatMsgs } = useContext(ChatContext) as ChatContextType;

    // Setting some local state
    const [profile, setShowprofile] = useState(false);
    const [showMenuDropdown, setShowMenuDropdown] = useState(false);
    const [enteredMsg, setEnteredMsg] = useState("");

    // Settings and members modal show state
    const [showSetModal, setShowSetModal] = useState(false);
    const [membersMdl, showMembersMdl] = useState(false);
    const [currentUser, setCurrentUser] = useState<chatUser>();
    const [lastUsers, setLastUsers] = useState([]);

    // functions
    function showUsrMenu() {
        setShowMenuDropdown(!showMenuDropdown);
    }

    const router = useRouter();

    // refs
    const msgsDisplayDiv = useRef<any>();
    const token = getCookie("jwt");


    const getLastUsers = async () => {

        socket_notif.emit("getConversations", [], (response: any) => {

            if (response != undefined)
                setLastUsers(response);

            // handling the route login received
            if (props.login) {
                // check first if login exists
                let item: any = response.find((user: any) => user.login == props.login);

                if (item != undefined) {
                    setCurrentUser(item);
                    // get messages 
                    socket_notif.emit("getMsgs", item?.convId, (response: any) => {
                        setChatMsgs(response);
                        // run on first render only
                        scrollToBottom(messagesEndRef);
                    })

                } else {
                    // if user doesnt exist start a new converation
                    fetchDATA(setCurrentUser, router, `chat/loginInfo/${props.login}`);
                    setChatMsgs([]);
                }
            }
        })
    }

    // UseEffect here
    useEffect(() => {
        // lets make an asychronous call here
        if (props.login !== undefined) {
            getLastUsers();
            setShowCnv(true);
            console.log(currentUser);
            if (profile)
                setShowprofile(false);
        }
        else if (props.login == undefined) {
            setCurrentUser(undefined);
            router.push("/chat");
        }
        // run on first render only
        scrollToBottom(messagesEndRef);
    }, [props.login])

    useEffect(() => {
        // listening for new messages
        socket_notif.on("newMsg", (response) => {
            setChatMsgs([...chatMsgs, response] as any);
            setEnteredMsg("");
            // scroll conversation messages to bottom
            scrollToBottom(messagesEndRef);
        })

        return () => {
            socket_notif.off('newMsg');
        }

    }, [chatMsgs]);

    const unshowCnv = () => {
        setShowCnv(false);
        router.push("/chat");
    }

    return (<div className={`${Styles.chatRight} ${showCnv ? Styles.displayChat : ""}`}>
        <MembersModal showSetModal={membersMdl} setShowSetModal={showMembersMdl} />
        <SettingsModal showSetModal={showSetModal} setShowSetModal={setShowSetModal} />
        {currentUser && <div className={`${Styles.rightContent}`} >
            {currentUser && (<>
                <div className={Styles.topDetails}>
                    <div className={Styles.flex}>
                        <div className={Styles.arrowAsset}>
                            <Image src={arrowBack} width={16} height={16} onClick={unshowCnv} />
                        </div>

                        {profile && <div onClick={() => setShowprofile(false)}><BackArrow /></div>}

                        <div onClick={currentUser?.membersNum ? () => showProfile(profile, setShowprofile) : null} className={Styles.flex}>
                            <div className={Styles.avatarProps}>
                                <img src={currentUser?.avatar} className={Styles.avatar} />
                            </div>
                            <div>
                                <h1 className={Styles.chatUsername}>{currentUser?.name ? currentUser.name : currentUser?.name}</h1>
                                <p className={Styles.chatUserStatus}>{currentUser?.status ? currentUser?.status : "+" + currentUser?.membersNum + " members"}</p>
                            </div>
                        </div>

                    </div>
                    <div className={Styles.menu} onClick={showUsrMenu}><MenuAsset />
                        {showMenuDropdown && <MenuDropdown content={currentUser.type == "Dm" ? [, "Block User"] : ["Settings", "Leave Channel"]} functions={[() => setShowSetModal(true), () => console.log("test")]} />}
                    </div>

                </div>
                {profile && (<Profile setShowSetModal={props.setShowSetModal} />)}
                {currentUser && !profile && <div className={Styles.chatSection}>
                    {chatMsgs.length != 0 && <div className={Styles.msgsDisplay} ref={msgsDisplayDiv}>
                        {
                            chatMsgs.map((chatMsg: any, i: any) => <div key={i} className={Styles.chatMsg} style={{ left: chatMsg.sender == currentUser.login ? "0" : "auto", right: chatMsg.sender != currentUser.login ? "0" : "auto" }}>
                                {(currentUser.convId == chatMsg.convId) && <div className={Styles.msgBox} style={{ justifyContent: chatMsg.sender == currentUser.login ? "flex-start" : "flex-end" }}>
                                    <div ref={messagesEndRef} className={Styles.msgContent} style={{ backgroundColor: chatMsg.sender == currentUser.login ? "#3A3A3C" : "#409CFF", borderRadius: chatMsg.sender == currentUser.login ? "0 5px 5px 5px" : "5px 5px 0 5px" }}>
                                        {chatMsg.msg}
                                    </div>
                                </div>}
                                {(currentUser.convId == chatMsg.convId) && <div className={Styles.msgTime} style={{ justifyContent: chatMsg.sender == currentUser.login ? "flex-start" : "flex-end" }}>{chatMsg?.date?.substring(16, 11)}{chatMsg?.createDate?.substring(16, 11)}</div>}
                            </div>)}
                    </div>}
                    {
                        chatMsgs.length == 0 && <div className={Styles.newCnv}>
                            <h1>{`Send your friend ${currentUser.name} a new message.`}</h1>
                        </div>
                    }
                    <div className={Styles.sendDiv} style={{ gap: enteredMsg != "" ? "1.5rem" : "0" }}>
                        <div className={Styles.msgInput}>
                            <input type="text" placeholder="message" value={enteredMsg} onChange={(e) => setEnteredMsg(e.target.value)} onKeyDown={(event) => setMsg(event.keyCode, enteredMsg, setEnteredMsg, currentUser.convId, currentUser.login, setChatMsgs, chatMsgs)} />
                            <div onClick={() => sendInvite} className={Styles.console}><GameIconAsset color="#D9D9D9" /></div>
                        </div>
                        <div onClick={(e) => setMsg(13, enteredMsg, setEnteredMsg, currentUser.convId, currentUser.login, setChatMsgs, chatMsgs)} className={Styles.sendCtr}>{enteredMsg && <Image src={sendArrow} width={30} height={30} className={Styles.animatedBtn} />}</div>
                    </div>

                </div>}
            </>)}
        </div>}

        {(currentUser == undefined) && (<div className={Styles.newCnv}>
            <h1>Start a new conversation</h1>
        </div>)}
    </div>)
}

export function InviteMsg(invitedUser: chatUser) {
    return (<div className={Styles.inviteMsg}>
        <div>
            <Image src={invitedUser.avatar} width={38} height={38} className={Styles.inviteAvatar} />
            <div>
                {invitedUser.name}
                <p>You invite them to play pong game</p>
            </div>
        </div>
        <button className={Styles.inviteBtn}>Cancel Invitation</button>
    </div>)
}

export const MenuDropdown = (props: { content: Array<string>, functions: Array<any> }) => {

    return (<div className={Styles.menuDropdown}>
        {props.content.map((element, i) => <div key={i} onClick={props.functions[i]} className={(i == 1) ? Styles.redText : ""}>{element}</div>)}
    </div>)
}

// keep for later
// ${showCnv ? Styles.displayChat : ""}