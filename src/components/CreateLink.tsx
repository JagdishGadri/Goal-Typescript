import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { FEED_QUERY } from "./LinkList";
import { AUTH_TOKEN, LINKS_PER_PAGE } from "../constants";
import { ICachedLinksData, LinkFormState } from "../types/CreateLink";

const CREATE_LINK_MUTATION = gql`
  mutation PostMutation($description: string, $url: string) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

const CreateLink = () => {
  const navigate = useNavigate();

  const [newLinkData, setNewLinkData] = useState<LinkFormState>({
    description: "",
    url: "",
  });

  //  Generics example
  const updateLinkData = <T,>(updatedKey: string, updatedValue: T) => {
    setNewLinkData((prevLinkData) => {
      const newLinkData = {
        ...prevLinkData,
        [updatedKey]: updatedValue,
      };
      return newLinkData;
    });
  };

  const [createLink, newLink] = useMutation(CREATE_LINK_MUTATION, {
    variables: {
      description: newLinkData.description,
      url: newLinkData.url,
    },
    update: (cache, { data: { post } }) => {
      const take = LINKS_PER_PAGE;
      const skip = 0;
      const orderBy = { createdAt: "desc" };
      const data = cache.readQuery<ICachedLinksData>({
        query: FEED_QUERY,
        variables: {
          take,
          skip,
          orderBy,
        },
      });

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: [post, ...data!.feed.links],
          },
        },
        variables: {
          take,
          skip,
          orderBy,
        },
      });
    },
    onCompleted: () => navigate("/"),
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createLink();
        }}
      >
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={newLinkData.description}
            onChange={(e) => updateLinkData("description", e.target.value)}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={newLinkData.url}
            onChange={(e) => updateLinkData("url", e.target.value)}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateLink;
