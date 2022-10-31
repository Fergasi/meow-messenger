import React, { useEffect, useState } from "react";
import Header from "../layout/Header";
import Chats from "./Chats";
import Axios from "../../utils/Axios";
import debounce from "lodash.debounce";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { ChatState } from "../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../redux-state/userSlice";
import { LinearProgress } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { Avatar } from "@mui/material";

const Sidebar = ({ fetchAgain, setFetchAgain }) => {
  const user = useSelector((state) => state.user);
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const { setError, chats, setSelectedChat, setChats } = ChatState();

  const handleSearch = async (search, cb) => {
    if (!search) {
      return;
    }
    try {
      const { data } = await Axios.get(`/api/chat/search?search=${search}`);
      cb(data);
    } catch (e) {
      setError({ status: true, message: "Network Error" });
      setTimeout(() => {
        setError({ status: false, message: "" });
      }, 5000);

      if (e.response.status === 401) {
        dispatch(signOut());
        navigate("/sign-in");
      }
    }
  };

  const debouncedFetchData = debounce((search, cb) => {
    handleSearch(search, cb);
  }, 1000);

  const accessChat = async (userId) => {
    setSearch("");
    try {
      setChatLoading(true);

      const { data } = await Axios.post("/api/chat", { userId });

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setChatLoading(false);
    } catch (e) {
      setError({
        status: true,
        message: "Error creating chat, please try again...",
      });
      setTimeout(() => {
        setError({ status: false, message: "" });
      }, 5000);

      if (e.response.status === 401) {
        dispatch(signOut());
        navigate("/sign-in");
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    debouncedFetchData(search, (res) => {
      setSearchResult(res);
      setLoading(false);
    });
  }, [search]);

  useEffect(() => {
    setSearchResult([]);
    setLoading(false);
  }, [search.length === 0]);

  return (
    <div className='sidebar'>
      <Header />
      <div className='search'>
        <div className='searchForm'>
          <input
            value={search}
            type='text'
            placeholder='Search users...'
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          {loading && (
            <CircularProgress
              size='15px'
              color='secondary'
              sx={{ marginRight: "10px" }}
            />
          )}

          {search && (
            <IconButton
              sx={{ height: "18px", width: "18px" }}
              onClick={() => setSearch("")}
            >
              <CloseIcon
                sx={{ height: "18px", width: "18px", color: "lightgray" }}
              />
            </IconButton>
          )}
        </div>
      </div>
      <div className='searchResultsPlusChats'>
        {search &&
          searchResult.length > 0 &&
          searchResult.map((result) => (
            <div
              key={result._id}
              className='searchedChats'
              onClick={() => accessChat(result._id)}
            >
              <div className='userChat'>
                <Avatar
                  key={result._id}
                  style={{
                    border: "2px solid white",
                    backgroundColor: result.profilePicture === "" ? "pink" : "",
                  }}
                  alt={result.name}
                  src={
                    result.profilePicture === ""
                      ? result.name[0]
                      : result.profilePicture
                  }
                />
                <div className='userChatInfo'>
                  <span>{result.name}</span>
                </div>
              </div>
              {chatLoading && <LinearProgress />}
            </div> //Chat loading bar possibly unnecessary
          ))}

        <Chats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </div>
    </div>
  );
};

export default Sidebar;
