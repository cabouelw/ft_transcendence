import Styles from "@styles/Chat/ChatConversations.module.css";
import {
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
} from "react";
import Searchicon from "../../public/SearchIcon.svg";
import Addchannel from "../../public/Chat/AddChannel.svg";
import Addchannelselected from "../../public/Chat/AddChannelSelected.svg";
import { ChannelData, conversations, initialconv, MsgData } from "@Types/dataTypes";
import { Conversation } from "./Conversation";
import { CreateChannel } from "./CreateChannel";
import { fetchDATA } from "@hooks/useFetchData";
import { useRouter } from "next/router";

const initialChnlState: ChannelData = {
  avatar: "",
  name: "",
  type: "Public",
  password: "",
  members: [],
};

interface Props {
  isMobile: boolean;
  convs : conversations[];
  setConvData: Dispatch<SetStateAction<conversations>>;
}

export const ChatConversations: React.FC<Props> = ({
  isMobile,
  convs,  
  setConvData,
}) => {
  const [showAddChannel, setshowAddChannel] = useState<boolean>(false);
  const [searchConv, setsearchConv] = useState<string>("");
  const [selectedConv, setselectedConv] = useState<string | string[]>("0");
  const router = useRouter();


  /* -------------------------------------------------------------------------- */
  /*                      get the query from route if exist                     */
  /* -------------------------------------------------------------------------- */

  useLayoutEffect(() => {
    if (router.query.login) {
      const id = router.query.login;
      setselectedConv(id);
    } else if (router.query.channel) {
      const id = router.query.channel;
      setselectedConv(id);
    } else {
      setselectedConv("0");
    }
  }, [router.query]);

  /* -------------------------------------------------------------------------- */
  /*                             check if conv exist                            */
  /* -------------------------------------------------------------------------- */

  useLayoutEffect(() => {
    if (convs.length > 0) {
      const foundconv = convs.find((conv) => conv.convId === selectedConv);
      if (foundconv) {
        setConvData(foundconv);
      } else setConvData(initialconv);
      if (selectedConv !== "0")
        foundconv?.type === "Dm"
          ? router.replace({
              pathname: `/chat`,
              query: { login: selectedConv },
            })
          : router.replace({
              pathname: `/chat`,
              query: { channel: selectedConv },
            });
    }
  }, [selectedConv, convs]);

  const AddChannelClickHandler = () => {
    setshowAddChannel(true);
  };

  const CloseChannelHandler = () => {
    setshowAddChannel(false);
  };

  return (
    <>
      {showAddChannel && (
        <CreateChannel
          isUpdate={false}
          initialChnlState={initialChnlState}
          CloseChannelHandler={CloseChannelHandler}
        />
      )}
      <div
        className={Styles.ChatConversations}
        style={
          isMobile
            ? selectedConv === "0"
              ? { width: "100%" }
              : { width: "0" }
            : {}
        }
      >
        <div className={Styles.ChatConvHeader}>
          <div>Messsages</div>
          <div
            className={Styles.AddChannelicn}
            onClick={AddChannelClickHandler}
          >
            {(!showAddChannel && (
              <img src={Addchannel.src} alt="addchannel"></img>
            )) || (
              <img src={Addchannelselected.src} alt="addchannelselected"></img>
            )}
          </div>
        </div>
        <div className={Styles.ConvSearch}>
          <img src={Searchicon.src} alt="ConvSearchicon" />
          <input
            type={"text"}
            placeholder="Search"
            onChange={(e) => setsearchConv(e.target.value)}
          ></input>
        </div>
        <div className={Styles.Conversationlist}>
          {convs.map((conv: conversations) => {
            if (conv.name.toUpperCase().includes(searchConv.toUpperCase()))
              return (
                <Conversation
                  key={conv.convId}
                  convId={conv.convId}
                  avatar={conv.avatar}
                  name={conv.name}
                  membersNum={conv.membersNum}
                  status={conv.status}
                  unread={conv.unread}
                  type={conv.type}
                  selected={selectedConv === conv.convId}
                  setSelectedConv={setselectedConv}
                />
              );
          })}
        </div>
      </div>
    </>
  );
};
