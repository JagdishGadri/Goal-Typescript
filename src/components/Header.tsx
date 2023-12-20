import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_TOKEN } from "../constants";
import { useMutation, gql } from "@apollo/client";
import "../styles/index.css";

const USERDATA_AUTHPAYLOAD = gql`
  mutation getAuthUserData($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        name
      }
    }
  }
`;

const Header = ({ userCred }) => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const navigate = useNavigate();
  const authToken = localStorage.getItem(AUTH_TOKEN);
  const [login, { data, loading, error }] = useMutation(USERDATA_AUTHPAYLOAD, {
    variables: {
      email: userCred?.email,
      password: userCred?.password,
    },
    onCompleted: ({ login }) => {
      localStorage.setItem("loggedInUser", login?.user?.name);
    },
  });

  useEffect(() => {
    login();
  }, [userCred]);
  return (
    <div className="flex pa1 justify-between nowrap orange header">
      <div className="flex flex-fixed black">
        <Link to="/" className="no-underline black">
          <div className="fw8 mr1 mt1">Hacker News</div>
        </Link>
        <Link to="/" className="ml1 no-underline black button nav">
          New
        </Link>
        <div className="ml1 mt1">|</div>
        <Link to="/top" className="ml1 no-underline black button nav">
          Top Voted
        </Link>
        <div className="ml1 mt1">|</div>
        <Link to="/search" className="ml1 no-underline black button nav">
          Search
        </Link>
        {authToken && (
          <div className="flex">
            <div className="ml1 mt1">|</div>
            <Link to="/create" className="ml1 no-underline black button nav">
              Submit
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-fixed">
        {authToken ? (
          <div
            className="ml1 pointer black button logout"
            onClick={() => {
              localStorage.removeItem(AUTH_TOKEN);
              navigate(`/`);
            }}
          >
            {loggedInUser ? loggedInUser : data?.login?.user?.name} (Logout)
          </div>
        ) : (
          <Link to="/login" className="ml1 no-underline black">
            <div className="button logout">Login</div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
