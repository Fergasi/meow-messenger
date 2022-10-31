import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Layout from "../layout/Layout";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../chat/Sidebar";
import Chat from "../chat/Chat";

const HomePage = () => {
  let navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
  }, [user]);

  return (
    <Layout>
      <div className='home'>
        {user && (
          <div className='container'>
            <Sidebar fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            <Chat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;
